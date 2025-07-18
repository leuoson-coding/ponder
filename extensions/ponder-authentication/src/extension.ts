import * as vscode from 'vscode';
import { PonderAuthProvider } from './authProvider';
import { PonderAuthenticationTelemetryReporter } from './telemetryReporter';
import Logger from './logger';

let authProvider: PonderAuthProvider;
let telemetryReporter: PonderAuthenticationTelemetryReporter;

/**
 * 扩展激活函数
 * 当扩展被激活时调用，初始化认证提供者和相关命令
 * @param context 扩展上下文
 */
export async function activate(context: vscode.ExtensionContext) {
    Logger.info('Activating Ponder Authentication extension');

    // 初始化遥测报告器
    telemetryReporter = new PonderAuthenticationTelemetryReporter(
        context.extension.packageJSON.aiKey
    );

    // 创建认证提供者
    authProvider = new PonderAuthProvider(context, telemetryReporter, Logger);

    // 注册认证提供者
    context.subscriptions.push(
        vscode.authentication.registerAuthenticationProvider(
            'ponder-service',
            'Ponder Service',
            authProvider,
            {
                supportsMultipleAccounts: true
            }
        )
    );

    // 注册登录命令
    context.subscriptions.push(
        vscode.commands.registerCommand('ponder-authentication.login', async () => {
            try {
                await vscode.authentication.getSession('ponder-service', ['user'], { createIfNone: true });
                vscode.window.showInformationMessage('登录成功！');
            } catch (error: any) {
                vscode.window.showErrorMessage(`登录失败: ${error.message}`);
            }
        })
    );

    // 注册登出命令
    context.subscriptions.push(
        vscode.commands.registerCommand('ponder-authentication.logout', async () => {
            try {
                const sessions = await vscode.authentication.getSession('ponder-service', [], { createIfNone: false, silent: true });
                if (sessions) {
                    await authProvider.removeSession(sessions.id);
                    vscode.window.showInformationMessage('已退出登录');
                } else {
                    vscode.window.showInformationMessage('当前未登录');
                }
            } catch (error) {
                vscode.window.showInformationMessage('当前未登录');
            }
        })
    );

    // 示例：获取用户信息命令
    context.subscriptions.push(
        vscode.commands.registerCommand('ponder-authentication.getUserInfo', async () => {
            try {
                const session = await vscode.authentication.getSession('ponder-service', ['user'], { createIfNone: false });
                if (!session) {
                    vscode.window.showWarningMessage('请先登录');
                    return;
                }

                const serverUrl = vscode.workspace.getConfiguration('ponder-authentication').get<string>('serverUrl') || 'http://localhost:3001';
                const response = await fetch(`${serverUrl}/vscode/auth/user`, {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const userData = await response.json() as { username: string; email: string };
                vscode.window.showInformationMessage(`当前用户: ${userData.username} (${userData.email})`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`获取用户信息失败: ${error.message}`);
            }
        })
    );

    // 注册状态栏项目（可选）
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'ponder-authentication.login';
    statusBarItem.text = '$(account) Ponder';
    statusBarItem.tooltip = '点击登录到 Ponder 服务';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // 监听认证会话变化，更新状态栏
    context.subscriptions.push(
        vscode.authentication.onDidChangeSessions(async (e) => {
            if (e.provider.id === 'ponder-service') {
                try {
                    const session = await vscode.authentication.getSession('ponder-service', [], { createIfNone: false, silent: true });
                    if (session) {
                        statusBarItem.text = `$(account) ${session.account.label}`;
                        statusBarItem.tooltip = '已登录到 Ponder 服务，点击查看用户信息';
                        statusBarItem.command = 'ponder-authentication.getUserInfo';
                    } else {
                        statusBarItem.text = '$(account) Ponder';
                        statusBarItem.tooltip = '点击登录到 Ponder 服务';
                        statusBarItem.command = 'ponder-authentication.login';
                    }
                } catch (error) {
                    statusBarItem.text = '$(account) Ponder';
                    statusBarItem.tooltip = '点击登录到 Ponder 服务';
                    statusBarItem.command = 'ponder-authentication.login';
                }
            }
        })
    );

    Logger.info('Ponder Authentication extension activated');
}

/**
 * 扩展停用函数
 * 当扩展被停用时调用，清理资源
 */
export function deactivate() {
    Logger.info('Deactivating Ponder Authentication extension');

    // 释放遥测报告器资源
    if (telemetryReporter) {
        telemetryReporter.dispose();
    }
}
