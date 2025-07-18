import TelemetryReporter from '@vscode/extension-telemetry';

/**
 * Ponder 认证扩展遥测报告器
 * 用于收集用户使用数据和错误信息，帮助改进产品
 */
export class PonderAuthenticationTelemetryReporter {
    private readonly telemetryReporter: TelemetryReporter | undefined;

    constructor(aiKey?: string) {
        if (aiKey) {
            this.telemetryReporter = new TelemetryReporter(aiKey);
        }
    }

    /**
     * 发送登录尝试事件
     */
    sendLoginAttemptEvent(): void {
        this.telemetryReporter?.sendTelemetryEvent('ponder.auth.loginAttempt');
    }

    /**
     * 发送登录成功事件
     */
    sendLoginSuccessEvent(): void {
        this.telemetryReporter?.sendTelemetryEvent('ponder.auth.loginSuccess');
    }

    /**
     * 发送登录失败事件
     */
    sendLoginFailedEvent(): void {
        this.telemetryReporter?.sendTelemetryEvent('ponder.auth.loginFailed');
    }

    /**
     * 发送登出事件
     */
    sendLogoutEvent(): void {
        this.telemetryReporter?.sendTelemetryEvent('ponder.auth.logout');
    }

    /**
     * 释放资源
     */
    dispose(): void {
        this.telemetryReporter?.dispose();
    }
}
