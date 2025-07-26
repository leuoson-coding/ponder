/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PonderConfig } from './config';
import { LocalCallbackServer } from './callbackServer';
import { Logger } from './logger';
import { UriEventHandler } from './ponderAuthProvider';
import { IPonderTokenResponse } from './ponderAuthProvider';

export class PonderOAuthFlow implements vscode.Disposable {
	private _disposables: vscode.Disposable[] = [];

	constructor(
		private readonly _logger: Logger,
		_uriHandler: UriEventHandler
	) {}

	async startOAuthFlow(scopes: string[]): Promise<IPonderTokenResponse> {
		this._logger.info('Starting OAuth flow...');

		// Get server address from configuration
		const config = vscode.workspace.getConfiguration('ponder');
		const serverAddress = config.get<string>('serverAddress', PonderConfig.serverAddress);

		// Start local callback server
		const callbackServer = new LocalCallbackServer(this._logger);
		this._disposables.push(callbackServer);

		try {
			const port = await callbackServer.start();
			const redirectUri = `http://127.0.0.1:${port}/callback`;

			// Get OAuth state from server
			const state = await this._getOAuthState(serverAddress);

			// Build authorization URL
			const authUrl = this._buildAuthorizationUrl(serverAddress, redirectUri, state, scopes);

			// Open browser
			this._logger.info(`Opening browser to: ${authUrl}`);
			await vscode.env.openExternal(vscode.Uri.parse(authUrl));

			// Wait for callback
			const callbackResult = await callbackServer.waitForCallback();

			if (callbackResult.error) {
				throw new Error(`OAuth error: ${callbackResult.error}`);
			}

			if (callbackResult.state !== state) {
				throw new Error('Invalid state parameter');
			}

			// Exchange code for token
			const tokenResponse = await this._exchangeCodeForToken(
				serverAddress,
				callbackResult.code,
				redirectUri
			);

			this._logger.info('OAuth flow completed successfully');
			return tokenResponse;

		} finally {
			await callbackServer.stop();
		}
	}

	private async _getOAuthState(serverAddress: string): Promise<string> {
		const response = await fetch(`${serverAddress}/api/oauth/ponder/state`);
		if (!response.ok) {
			throw new Error(`Failed to get OAuth state: ${response.statusText}`);
		}

		const data = await response.json() as any;
		if (!data.success) {
			throw new Error(`OAuth state error: ${data.message}`);
		}

		return data.data;
	}

	private _buildAuthorizationUrl(
		serverAddress: string,
		redirectUri: string,
		state: string,
		scopes: string[]
	): string {
		const params = new URLSearchParams({
			client_id: PonderConfig.clientId,
			redirect_uri: redirectUri,
			state: state,
			scope: scopes.join(' '),
			response_type: 'code'
		});

		return `${serverAddress}/oauth/ponder?${params.toString()}`;
	}

	private async _exchangeCodeForToken(
		serverAddress: string,
		code: string,
		redirectUri: string
	): Promise<IPonderTokenResponse> {
		const response = await fetch(`${serverAddress}/api/oauth/ponder/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				code: code,
				client_id: PonderConfig.clientId,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code'
			})
		});

		if (!response.ok) {
			throw new Error(`Token exchange failed: ${response.statusText}`);
		}

		const data = await response.json() as any;
		if (!data.success) {
			throw new Error(`Token exchange error: ${data.message}`);
		}

		return data.data;
	}

	dispose(): void {
		this._disposables.forEach(d => d.dispose());
	}
}
