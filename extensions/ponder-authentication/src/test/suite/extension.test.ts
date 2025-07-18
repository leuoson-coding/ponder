import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Ponder Authentication Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('ponder.ponder-authentication'));
    });

    test('Should register authentication provider', async () => {
        const providers = await vscode.authentication.getProviderIds();
        assert.ok(providers.includes('ponder-service'));
    });

    test('Should register commands', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('ponder-authentication.login'));
        assert.ok(commands.includes('ponder-authentication.logout'));
        assert.ok(commands.includes('ponder-authentication.getUserInfo'));
    });
});
