# Ponder OAuth Flow Testing Guide

## Prerequisites

1. **ponder-api server running** on `http://localhost:3000`
2. **Ponder client** with ponder-authentication extension installed
3. **Valid user account** in ponder-api database

## Configuration

### 1. ponder-api Configuration

Add the following to your ponder-api configuration:

```bash
# Environment variables or config file
PONDER_CLIENT_ID=ponder-client
PONDER_CLIENT_SECRET=your-secret-here
PONDER_OAUTH_ENABLED=true
```

### 2. ponder-authentication Extension Configuration

In VS Code settings:

```json
{
  "ponder.serverAddress": "http://localhost:3000"
}
```

## Testing Steps

### 1. Manual OAuth Flow Test

1. Open Ponder IDE
2. Open Command Palette (`Ctrl+Shift+P`)
3. Run command: `Developer: Reload Window`
4. Try to access a feature that requires authentication
5. Should trigger OAuth flow automatically

### 2. Direct Authentication Test

```typescript
// In Ponder IDE console
const session = await vscode.authentication.getSession('ponder', ['read', 'write'], { createIfNone: true });
console.log('Session:', session);
```

### 3. Expected Flow

1. **Client Request**: Ponder client requests authentication
2. **Browser Opens**: Browser opens to `http://localhost:3000/oauth/ponder?client_id=ponder-client&redirect_uri=http://127.0.0.1:PORT/callback&state=STATE&scope=read%20write`
3. **User Login**: User enters credentials on authorization page
4. **Authorization**: Server validates credentials and generates auth code
5. **Callback**: Browser redirects to local callback server with auth code
6. **Token Exchange**: Client exchanges auth code for access token
7. **Session Created**: Authentication session is created and stored

## Troubleshooting

### Common Issues

1. **"Invalid client_id"**: Check PONDER_CLIENT_ID configuration
2. **"Invalid state"**: Session state mismatch, try clearing browser cookies
3. **"Connection refused"**: Ensure ponder-api server is running
4. **"Port already in use"**: Local callback server port conflict

### Debug Logs

Check the "Ponder Authentication" output channel in VS Code for detailed logs.

### API Endpoints

- `GET /api/oauth/ponder/state` - Generate OAuth state
- `POST /api/oauth/ponder/authorize` - User authorization
- `POST /api/oauth/ponder/token` - Token exchange
- `GET /api/oauth/ponder/user` - Get user info

## Security Notes

- OAuth state parameter prevents CSRF attacks
- Local callback server uses random port and nonce
- Authorization codes expire in 10 minutes
- Access tokens expire in 24 hours
- All sensitive operations happen server-side
