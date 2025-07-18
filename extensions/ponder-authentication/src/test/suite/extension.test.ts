import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Ponder Authentication Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('ponder.ponder-authentication'));
	});

	test('Should register authentication provider', async () => {
		// 由于 VSCode API 限制，我们无法直接获取提供者列表
		// 这里我们测试扩展是否正确激活
		const extension = vscode.extensions.getExtension('ponder.ponder-authentication');
		assert.ok(extension);
		assert.ok(extension.isActive);
	});

	test('Should register commands', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('ponder-authentication.login'));
		assert.ok(commands.includes('ponder-authentication.logout'));
		assert.ok(commands.includes('ponder-authentication.getUserInfo'));
	});
});
