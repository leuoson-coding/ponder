import * as vscode from 'vscode';
import { PonderAuthenticationTelemetryReporter } from './telemetryReporter';
import Logger from './logger';

/**
 * Ponder 认证提供者
 * 实现 VSCode AuthenticationProvider 接口，提供完整的 OAuth 认证流程
 */
export class PonderAuthProvider implements vscode.AuthenticationProvider {
    private static readonly AUTH_TYPE = 'ponder-service';
    private static readonly SESSIONS_SECRET_KEY = `${PonderAuthProvider.AUTH_TYPE}.sessions`;

    private _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
    public readonly onDidChangeSessions = this._onDidChangeSessions.event;

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly telemetryReporter: PonderAuthenticationTelemetryReporter,
        private readonly logger: vscode.LogOutputChannel
    ) { }

    /**
     * 获取现有的认证会话
     * @param scopes 请求的权限范围
     * @returns 匹配的认证会话数组
     */
    async getSessions(scopes?: readonly string[]): Promise<vscode.AuthenticationSession[]> {
        this.logger.info('Getting existing sessions');
        const allSessions = await this.context.secrets.get(PonderAuthProvider.SESSIONS_SECRET_KEY);

        if (allSessions) {
            const sessions = JSON.parse(allSessions) as vscode.AuthenticationSession[];
            return sessions.filter(session =>
                scopes ? scopes.every(scope => session.scopes.includes(scope)) : true
            );
        }

        return [];
    }

    /**
     * 创建新的认证会话
     * @param scopes 请求的权限范围
     * @returns 新创建的认证会话
     */
    async createSession(scopes: readonly string[]): Promise<vscode.AuthenticationSession> {
        this.logger.info(`Creating session for scopes: ${scopes.join(', ')}`);

        try {
            this.telemetryReporter.sendLoginAttemptEvent();

            const serverUrl = this.getServerUrl();

            // 生成回调URI
            const callbackUri = await vscode.env.asExternalUri(
                vscode.Uri.parse(`${vscode.env.uriScheme}://ponder.ponder-authentication/auth-complete`)
            );

            // 获取授权URL
            const authResponse = await this.getAuthorizationUrl(serverUrl, scopes, callbackUri.toString());

            // 打开浏览器进行授权
            await vscode.env.openExternal(vscode.Uri.parse(authResponse.authorization_url));

            // 等待用户完成授权
            const authCode = await this.waitForAuthorizationCode();

            // 交换访问令牌
            const tokenData = await this.exchangeCodeForToken(serverUrl, authCode, authResponse.state, callbackUri.toString());

            // 创建会话
            const session: vscode.AuthenticationSession = {
                id: tokenData.account.id.toString(),
                accessToken: tokenData.access_token,
                account: {
                    id: tokenData.account.id.toString(),
                    label: tokenData.account.label
                },
                scopes: scopes as string[]
            };

            // 存储会话
            await this.addSession(session);

            this.telemetryReporter.sendLoginSuccessEvent();
            this.logger.info('Session created successfully');

            return session;
        } catch (error: any) {
            this.telemetryReporter.sendLoginFailedEvent();
            this.logger.error(`Failed to create session: ${error.message}`);
            throw new Error(`认证失败: ${error.message}`);
        }
    }

    /**
     * 移除认证会话
     * @param sessionId 要移除的会话ID
     */
    async removeSession(sessionId: string): Promise<void> {
        this.logger.info(`Removing session: ${sessionId}`);

        const allSessions = await this.getSessions();
        const sessionIndex = allSessions.findIndex(s => s.id === sessionId);

        if (sessionIndex > -1) {
            const session = allSessions[sessionIndex];
            allSessions.splice(sessionIndex, 1);

            await this.storeSessions(allSessions);

            this._onDidChangeSessions.fire({
                added: [],
                removed: [session],
                changed: []
            });

            this.telemetryReporter.sendLogoutEvent();
            this.logger.info('Session removed successfully');
        }
    }

    /**
     * 获取授权URL
     * @param serverUrl 服务器地址
     * @param scopes 权限范围
     * @param redirectUri 回调URI
     * @returns 授权响应数据
     */
    private async getAuthorizationUrl(serverUrl: string, scopes: readonly string[], redirectUri: string): Promise<{ authorization_url: string; state: string }> {
        // 直接构建登录页面 URL
        const url = new URL(`${serverUrl}/vscode/auth`);
        url.searchParams.set('redirect_uri', redirectUri);
        url.searchParams.set('scope', scopes.join(' '));

        const state = Date.now().toString(); // 生成状态参数
        url.searchParams.set('state', state);

        this.logger.info(`构建授权URL: ${url.toString()}`);

        // 直接返回登录页面 URL，不需要额外的 API 调用
        return {
            authorization_url: url.toString(),
            state: state
        };
    }

    /**
     * 等待用户完成授权并获取授权码
     * @returns 授权码
     */
    private async waitForAuthorizationCode(): Promise<string> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('授权超时'));
            }, 300000); // 5分钟超时

            // 注册URI处理器来接收授权码
            const disposable = vscode.window.registerUriHandler({
                handleUri: (uri: vscode.Uri) => {
                    if (uri.path === '/auth-complete') {
                        const query = new URLSearchParams(uri.query);
                        const code = query.get('code');
                        const error = query.get('error');

                        clearTimeout(timeout);
                        disposable.dispose();

                        if (error) {
                            reject(new Error(`授权失败: ${error}`));
                        } else if (code) {
                            resolve(code);
                        } else {
                            reject(new Error('未收到授权码'));
                        }
                    }
                }
            });

            // 显示等待提示
            vscode.window.showInformationMessage(
                '请在浏览器中完成登录授权...',
                '取消'
            ).then(selection => {
                if (selection === '取消') {
                    clearTimeout(timeout);
                    disposable.dispose();
                    reject(new Error('用户取消授权'));
                }
            });
        });
    }

    /**
     * 使用授权码交换访问令牌
     * @param serverUrl 服务器地址
     * @param code 授权码
     * @param state 状态参数
     * @param redirectUri 回调URI
     * @returns 令牌数据
     */
    private async exchangeCodeForToken(serverUrl: string, code: string, state: string, redirectUri: string): Promise<{ access_token: string; account: { id: string; label: string } }> {
        const requestBody = {
            code: code,
            state: state,
            redirect_uri: redirectUri
        };

        this.logger.info(`交换访问令牌请求: ${serverUrl}/vscode/auth/callback`);
        this.logger.info(`请求体: ${JSON.stringify(requestBody)}`);

        const response = await fetch(`${serverUrl}/vscode/auth/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        this.logger.info(`令牌交换响应状态: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`令牌交换请求失败: ${response.status} ${response.statusText}, 响应内容: ${errorText}`);
            throw new Error(`令牌交换失败: ${response.statusText}`);
        }

        const responseText = await response.text();
        this.logger.info(`令牌交换响应内容: ${responseText.substring(0, 200)}...`);

        if (!responseText.trim()) {
            this.logger.error('令牌交换响应为空');
            throw new Error('服务器返回空响应');
        }

        try {
            const tokenData = JSON.parse(responseText) as any;

            if (tokenData.error) {
                this.logger.error(`令牌交换返回错误: ${tokenData.error} - ${tokenData.error_description}`);
                throw new Error(tokenData.error_description || tokenData.error);
            }

            return tokenData as { access_token: string; account: { id: string; label: string } };
        } catch (error) {
            if (error instanceof SyntaxError) {
                this.logger.error(`解析令牌交换响应JSON失败: ${error}, 原始响应: ${responseText}`);
                throw new Error(`服务器响应格式错误: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * 添加会话到存储
     * @param session 要添加的会话
     */
    private async addSession(session: vscode.AuthenticationSession): Promise<void> {
        const allSessions = await this.getSessions();
        const existingIndex = allSessions.findIndex(s => s.account.id === session.account.id);

        if (existingIndex > -1) {
            allSessions[existingIndex] = session;
        } else {
            allSessions.push(session);
        }

        await this.storeSessions(allSessions);

        this._onDidChangeSessions.fire({
            added: existingIndex > -1 ? [] : [session],
            removed: [],
            changed: existingIndex > -1 ? [session] : []
        });
    }

    /**
     * 存储会话到安全存储
     * @param sessions 要存储的会话数组
     */
    private async storeSessions(sessions: vscode.AuthenticationSession[]): Promise<void> {
        await this.context.secrets.store(PonderAuthProvider.SESSIONS_SECRET_KEY, JSON.stringify(sessions));
    }

    /**
     * 获取服务器URL配置
     * @returns 服务器URL
     */
    private getServerUrl(): string {
        return vscode.workspace.getConfiguration('ponder-authentication').get<string>('serverUrl') || 'http://localhost:3001';
    }
}
