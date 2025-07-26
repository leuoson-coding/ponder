# Ponder Authentication

This extension provides authentication support for Ponder IDE using OAuth 2.0 flow.

## Features

- OAuth 2.0 authentication with Ponder server
- Secure token storage and management
- Automatic session management
- Browser-based authentication flow

## Configuration

- `ponder.serverAddress`: The server address for Ponder authentication (default: http://localhost:3000)

## Usage

The extension automatically registers as an authentication provider for Ponder. Other extensions can request authentication using:

```typescript
const session = await vscode.authentication.getSession('ponder', ['read', 'write'], { createIfNone: true });
```

## Security

- Uses OAuth 2.0 authorization code flow
- Local callback server with random port and nonce verification
- State parameter for CSRF protection
- Secure token storage in VS Code's global state
