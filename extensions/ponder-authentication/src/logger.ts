import * as vscode from 'vscode';

/**
 * Ponder 认证扩展日志记录器
 * 提供统一的日志记录接口，方便调试和问题排查
 */
class Logger {
    private static _channel: vscode.LogOutputChannel;

    /**
     * 获取日志输出通道
     */
    static get outputChannel(): vscode.LogOutputChannel {
        if (!this._channel) {
            this._channel = vscode.window.createOutputChannel('Ponder Authentication', { log: true });
        }
        return this._channel;
    }

    /**
     * 记录信息级别日志
     * @param message 日志消息
     */
    static info(message: string): void {
        this.outputChannel.info(message);
    }

    /**
     * 记录警告级别日志
     * @param message 日志消息
     */
    static warn(message: string): void {
        this.outputChannel.warn(message);
    }

    /**
     * 记录错误级别日志
     * @param message 日志消息
     */
    static error(message: string): void {
        this.outputChannel.error(message);
    }

    /**
     * 记录跟踪级别日志
     * @param message 日志消息
     */
    static trace(message: string): void {
        this.outputChannel.trace(message);
    }

    /**
     * 显示日志输出通道
     */
    static show(): void {
        this.outputChannel.show();
    }
}

export default Logger.outputChannel;
