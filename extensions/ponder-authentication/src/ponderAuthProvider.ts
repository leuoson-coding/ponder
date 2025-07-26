/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PonderOAuthFlow } from './oauthFlow';
import { Logger } from './logger';

export class AuthenticationError extends Error { }

export interface IPonderUser {
	id: string;
	username: string;
	display_name: string;
	email: string;
}

export interface IPonderTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	user: IPonderUser;
}

export class UriEventHandler extends vscode.EventEmitter<vscode.Uri> implements vscode.UriHandler {
	public handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
		this.fire(uri);
	}
}

export class PonderAuthenticationProvider implements vscode.AuthenticationProvider, vscode.Disposable {
	private _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	onDidChangeSessions = this._onDidChangeSessions.event;

	private _sessions: vscode.AuthenticationSession[] = [];
	private _disposables: vscode.Disposable[] = [];
	private _oauthFlow: PonderOAuthFlow;
	private _logger: Logger;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		private readonly _uriHandler: UriEventHandler
	) {
		this._logger = new Logger();
		this._oauthFlow = new PonderOAuthFlow(this._logger, this._uriHandler);
		this._disposables.push(this._onDidChangeSessions);
		this._disposables.push(this._oauthFlow);
		this._disposables.push(this._logger);

		// Load existing sessions from storage
		this._loadSessions();
	}

	async getSessions(scopes?: string[]): Promise<vscode.AuthenticationSession[]> {
		this._logger.info(`Getting sessions for scopes: ${scopes?.join(', ') || 'all'}`);

		if (!scopes || scopes.length === 0) {
			return this._sessions;
		}

		// Filter sessions by scopes
		return this._sessions.filter(session =>
			scopes.every(scope => session.scopes.includes(scope))
		);
	}

	async createSession(scopes: string[]): Promise<vscode.AuthenticationSession> {
		this._logger.info(`Creating session for scopes: ${scopes.join(', ')}`);

		try {
			// Start OAuth flow
			const tokenResponse = await this._oauthFlow.startOAuthFlow(scopes);

			// Create session
			const session: vscode.AuthenticationSession = {
				id: tokenResponse.user.id,
				accessToken: tokenResponse.access_token,
				account: {
					id: tokenResponse.user.id,
					label: tokenResponse.user.display_name || tokenResponse.user.username
				},
				scopes: scopes
			};

			// Store session
			this._sessions.push(session);
			await this._storeSessions();

			// Fire change event
			this._onDidChangeSessions.fire({
				added: [session],
				removed: [],
				changed: []
			});

			this._logger.info(`Session created successfully for user: ${session.account.label}`);
			return session;

		} catch (error) {
			this._logger.error(`Failed to create session: ${error}`);
			throw new AuthenticationError('Failed to authenticate with Ponder');
		}
	}

	async removeSession(sessionId: string): Promise<void> {
		this._logger.info(`Removing session: ${sessionId}`);

		const sessionIndex = this._sessions.findIndex(session => session.id === sessionId);
		if (sessionIndex === -1) {
			this._logger.warn(`Session not found: ${sessionId}`);
			return;
		}

		const removedSession = this._sessions.splice(sessionIndex, 1)[0];
		await this._storeSessions();

		this._onDidChangeSessions.fire({
			added: [],
			removed: [removedSession],
			changed: []
		});

		this._logger.info(`Session removed: ${sessionId}`);
	}

	private async _loadSessions(): Promise<void> {
		try {
			const storedSessions = this._context.globalState.get<vscode.AuthenticationSession[]>('ponder.sessions', []);
			this._sessions = storedSessions;
			this._logger.info(`Loaded ${this._sessions.length} sessions from storage`);
		} catch (error) {
			this._logger.error(`Failed to load sessions: ${error}`);
			this._sessions = [];
		}
	}

	private async _storeSessions(): Promise<void> {
		try {
			await this._context.globalState.update('ponder.sessions', this._sessions);
			this._logger.info(`Stored ${this._sessions.length} sessions`);
		} catch (error) {
			this._logger.error(`Failed to store sessions: ${error}`);
		}
	}

	dispose(): void {
		this._disposables.forEach(d => d.dispose());
	}
}
