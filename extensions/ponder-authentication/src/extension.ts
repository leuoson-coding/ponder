import * as vscode from 'vscode';
import { PonderAuthProvider } from './authProvider';
import { PonderAuthenticationTelemetryReporter } from './telemetryReporter';
import Logger from './logger';

let authProvider: PonderAuthProvider;
let telemetryReporter: PonderAuthenticationTelemetryReporter;
let globalUriHandler: vscode.Disposable;

/**
 * Extension activation function
 * Called when the extension is activated, initializes authentication provider and related commands
 * @param context Extension context
 */
export async function activate(context: vscode.ExtensionContext) {
	Logger.info('Activating Ponder Authentication extension');

	// Set up context keys for menu visibility
	await vscode.commands.executeCommand('setContext', 'ponder-authentication.signedIn', false);

	// Initialize telemetry reporter
	telemetryReporter = new PonderAuthenticationTelemetryReporter(
		context.extension.packageJSON.aiKey
	);

	// Create authentication provider
	authProvider = new PonderAuthProvider(context, telemetryReporter, Logger);

	// Register global URI handler for authentication callbacks
	globalUriHandler = vscode.window.registerUriHandler({
		handleUri: (uri: vscode.Uri) => {
			Logger.info(`Received URI: ${uri.toString()}`);
			if (uri.path === '/auth-complete') {
				// Forward to auth provider if it's waiting for a callback
				if (authProvider && (authProvider as any).handleAuthCallback) {
					(authProvider as any).handleAuthCallback(uri);
				}
			}
		}
	});
	context.subscriptions.push(globalUriHandler);

	// Register authentication provider
	context.subscriptions.push(
		vscode.authentication.registerAuthenticationProvider(
			'ponder-service',
			'Ponder',
			authProvider,
			{
				supportsMultipleAccounts: true
			}
		)
	);

	// Register login command
	context.subscriptions.push(
		vscode.commands.registerCommand('ponder-authentication.login', async () => {
			try {
				const session = await vscode.authentication.getSession('ponder-service', ['user'], { createIfNone: true });
				if (session) {
					vscode.window.showInformationMessage(`Login successful! Welcome ${session.account.label}`);
				}
			} catch (error: any) {
				vscode.window.showErrorMessage(`Login failed: ${error.message}`);
			}
		})
	);

	// Register logout command
	context.subscriptions.push(
		vscode.commands.registerCommand('ponder-authentication.logout', async () => {
			try {
				const sessions = await vscode.authentication.getSession('ponder-service', [], { createIfNone: false, silent: true });
				if (sessions) {
					await authProvider.removeSession(sessions.id);
					vscode.window.showInformationMessage('Logged out successfully');
				} else {
					vscode.window.showInformationMessage('Not currently logged in');
				}
			} catch (error) {
				vscode.window.showInformationMessage('Not currently logged in');
			}
		})
	);

	// Example: Get user info command
	context.subscriptions.push(
		vscode.commands.registerCommand('ponder-authentication.getUserInfo', async () => {
			try {
				const session = await vscode.authentication.getSession('ponder-service', ['user'], { createIfNone: false });
				if (!session) {
					vscode.window.showWarningMessage('Please login first');
					return;
				}

				const serverUrl = vscode.workspace.getConfiguration('ponder-authentication').get<string>('serverUrl') || 'http://localhost:3001';
				const response = await fetch(`${serverUrl}/api/vscode/user`, {
					headers: {
						'Authorization': `Bearer ${session.accessToken}`
					}
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const userData = await response.json() as { username: string; email: string };
				vscode.window.showInformationMessage(`Current user: ${userData.username} (${userData.email})`);
			} catch (error: any) {
				vscode.window.showErrorMessage(`Failed to get user info: ${error.message}`);
			}
		})
	);

	// Register status bar item (optional)
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'ponder-authentication.login';
	statusBarItem.text = '$(account) Ponder';
	statusBarItem.tooltip = 'Click to login to Ponder service';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Listen for authentication session changes, update status bar
	context.subscriptions.push(
		vscode.authentication.onDidChangeSessions(async (e) => {
			if (e.provider.id === 'ponder-service') {
				try {
					const session = await vscode.authentication.getSession('ponder-service', [], { createIfNone: false, silent: true });
					if (session) {
						statusBarItem.text = `$(account) ${session.account.label}`;
						statusBarItem.tooltip = 'Logged in to Ponder service, click to view user info';
						statusBarItem.command = 'ponder-authentication.getUserInfo';
						await vscode.commands.executeCommand('setContext', 'ponder-authentication.signedIn', true);
					} else {
						statusBarItem.text = '$(account) Ponder';
						statusBarItem.tooltip = 'Click to login to Ponder service';
						statusBarItem.command = 'ponder-authentication.login';
						await vscode.commands.executeCommand('setContext', 'ponder-authentication.signedIn', false);
					}
				} catch (error) {
					statusBarItem.text = '$(account) Ponder';
					statusBarItem.tooltip = 'Click to login to Ponder service';
					statusBarItem.command = 'ponder-authentication.login';
					await vscode.commands.executeCommand('setContext', 'ponder-authentication.signedIn', false);
				}
			}
		})
	);

	// Trigger authentication request to show in accounts panel
	setTimeout(async () => {
		try {
			// Request a session to trigger the accounts panel to show our provider
			// This will make VS Code show "Sign in with Ponder Service" in the accounts panel
			await vscode.authentication.getSession('ponder-service', ['user'], { createIfNone: false, silent: false });
		} catch (error) {
			// This is expected - we just want to trigger the accounts panel to show our provider
			Logger.info('Authentication request triggered for accounts panel');
		}
	}, 2000);

	Logger.info('Ponder Authentication extension activated');
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated, cleans up resources
 */
export function deactivate() {
	Logger.info('Deactivating Ponder Authentication extension');

	// Release telemetry reporter resources
	if (telemetryReporter) {
		telemetryReporter.dispose();
	}
}
