/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from 'http';
import * as url from 'url';
import * as vscode from 'vscode';
import { Logger } from './logger';

export interface IOAuthCallbackResult {
	code: string;
	state: string;
	error?: string;
}

export class LocalCallbackServer implements vscode.Disposable {
	private _server?: http.Server;
	private _port?: number;
	private _callbackPromise?: Promise<IOAuthCallbackResult>;
	private _callbackResolve?: (result: IOAuthCallbackResult) => void;
	private _callbackReject?: (error: Error) => void;

	constructor(private readonly _logger: Logger) {}

	async start(): Promise<number> {
		if (this._server) {
			throw new Error('Server is already running');
		}

		return new Promise((resolve, reject) => {
			this._server = http.createServer(this._handleRequest.bind(this));
			
			this._server.on('error', (error) => {
				this._logger.error(`Server error: ${error.message}`);
				reject(error);
			});

			// Listen on a random available port
			this._server.listen(0, '127.0.0.1', () => {
				const address = this._server!.address();
				if (address && typeof address === 'object') {
					this._port = address.port;
					this._logger.info(`Callback server started on port ${this._port}`);
					resolve(this._port);
				} else {
					reject(new Error('Failed to get server address'));
				}
			});
		});
	}

	async stop(): Promise<void> {
		if (!this._server) {
			return;
		}

		return new Promise((resolve) => {
			this._server!.close(() => {
				this._logger.info('Callback server stopped');
				this._server = undefined;
				this._port = undefined;
				resolve();
			});
		});
	}

	waitForCallback(): Promise<IOAuthCallbackResult> {
		if (this._callbackPromise) {
			return this._callbackPromise;
		}

		this._callbackPromise = new Promise((resolve, reject) => {
			this._callbackResolve = resolve;
			this._callbackReject = reject;

			// Set timeout for callback
			setTimeout(() => {
				if (this._callbackReject) {
					this._callbackReject(new Error('OAuth callback timeout'));
				}
			}, 300000); // 5 minutes timeout
		});

		return this._callbackPromise;
	}

	private _handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
		this._logger.info(`Received request: ${req.method} ${req.url}`);

		if (req.method !== 'GET') {
			this._sendResponse(res, 405, 'Method Not Allowed');
			return;
		}

		const parsedUrl = url.parse(req.url || '', true);
		
		if (parsedUrl.pathname === '/callback') {
			this._handleCallback(parsedUrl.query, res);
		} else {
			this._sendResponse(res, 404, 'Not Found');
		}
	}

	private _handleCallback(query: any, res: http.ServerResponse): void {
		const code = query.code as string;
		const state = query.state as string;
		const error = query.error as string;

		if (error) {
			this._logger.error(`OAuth callback error: ${error}`);
			this._sendResponse(res, 400, `
				<html>
					<head><title>Ponder Authentication</title></head>
					<body>
						<h1>Authentication Failed</h1>
						<p>Error: ${error}</p>
						<p>You can close this window.</p>
					</body>
				</html>
			`, 'text/html');

			if (this._callbackResolve) {
				this._callbackResolve({ code: '', state: '', error });
			}
			return;
		}

		if (!code || !state) {
			this._logger.error('Missing code or state in callback');
			this._sendResponse(res, 400, `
				<html>
					<head><title>Ponder Authentication</title></head>
					<body>
						<h1>Authentication Failed</h1>
						<p>Missing required parameters</p>
						<p>You can close this window.</p>
					</body>
				</html>
			`, 'text/html');

			if (this._callbackResolve) {
				this._callbackResolve({ code: '', state: '', error: 'Missing parameters' });
			}
			return;
		}

		this._logger.info('OAuth callback received successfully');
		this._sendResponse(res, 200, `
			<html>
				<head><title>Ponder Authentication</title></head>
				<body>
					<h1>Authentication Successful</h1>
					<p>You have been successfully authenticated with Ponder.</p>
					<p>You can close this window and return to the application.</p>
					<script>
						setTimeout(() => window.close(), 3000);
					</script>
				</body>
			</html>
		`, 'text/html');

		if (this._callbackResolve) {
			this._callbackResolve({ code, state });
		}
	}

	private _sendResponse(res: http.ServerResponse, statusCode: number, body: string, contentType = 'text/plain'): void {
		res.writeHead(statusCode, {
			'Content-Type': contentType,
			'Content-Length': Buffer.byteLength(body)
		});
		res.end(body);
	}

	dispose(): void {
		if (this._callbackReject) {
			this._callbackReject(new Error('Server disposed'));
		}
		this.stop().catch(error => {
			this._logger.error(`Error stopping server: ${error.message}`);
		});
	}
}
