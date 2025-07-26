/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export class Logger implements vscode.Disposable {
	private _outputChannel: vscode.OutputChannel;

	constructor() {
		this._outputChannel = vscode.window.createOutputChannel('Ponder Authentication');
	}

	info(message: string): void {
		const timestamp = new Date().toISOString();
		this._outputChannel.appendLine(`[${timestamp}] INFO: ${message}`);
	}

	warn(message: string): void {
		const timestamp = new Date().toISOString();
		this._outputChannel.appendLine(`[${timestamp}] WARN: ${message}`);
	}

	error(message: string): void {
		const timestamp = new Date().toISOString();
		this._outputChannel.appendLine(`[${timestamp}] ERROR: ${message}`);
	}

	show(): void {
		this._outputChannel.show();
	}

	dispose(): void {
		this._outputChannel.dispose();
	}
}
