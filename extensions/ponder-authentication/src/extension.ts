/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PonderAuthenticationProvider, UriEventHandler } from './ponderAuthProvider';

export function activate(context: vscode.ExtensionContext) {
	const uriHandler = new UriEventHandler();
	context.subscriptions.push(uriHandler);
	context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

	const ponderAuthProvider = new PonderAuthenticationProvider(context, uriHandler);
	context.subscriptions.push(ponderAuthProvider);
	context.subscriptions.push(vscode.authentication.registerAuthenticationProvider(
		'ponder',
		'Ponder',
		ponderAuthProvider,
		{ supportsMultipleAccounts: false }
	));

	// 注册测试命令
	const testCommand = vscode.commands.registerCommand('ponder.testAuthentication', async () => {
		try {
			vscode.window.showInformationMessage('Starting Ponder authentication...');
			const session = await vscode.authentication.getSession('ponder', ['read', 'write'], { createIfNone: true });
			vscode.window.showInformationMessage(`Authentication successful! User: ${session.account.label}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Authentication failed: ${error}`);
		}
	});

	context.subscriptions.push(testCommand);
}

export function deactivate() {
	// Nothing to do
}
