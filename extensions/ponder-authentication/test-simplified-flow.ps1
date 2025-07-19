# VSCode身份验证简化流程测试脚本

Write-Host "=== VSCode身份验证简化流程测试 ===" -ForegroundColor Green
Write-Host ""

$serverUrl = "http://localhost:3001"
$username = "root"
$password = "123456"
$state = "test-state-$(Get-Date -Format 'yyyyMMddHHmmss')"
$redirectUri = "vscode://ponder.ponder-authentication/auth-complete"

# 测试1: 直接登录获取授权码
Write-Host "步骤1: 测试直接登录获取授权码..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = $username
        password = $password
        state = $state
        redirect_uri = $redirectUri
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$serverUrl/api/vscode/login" -Method POST -ContentType "application/json" -Body $loginBody
    
    Write-Host "✅ 登录成功!" -ForegroundColor Green
    Write-Host "   授权码: $($loginResponse.auth_code.Substring(0,16))..." -ForegroundColor Cyan
    Write-Host "   用户: $($loginResponse.user.username)" -ForegroundColor Cyan
    Write-Host "   状态: $($loginResponse.state)" -ForegroundColor Cyan
    
    $authCode = $loginResponse.auth_code
    $returnedState = $loginResponse.state
} catch {
    Write-Host "❌ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 测试2: 用授权码换取JWT令牌
Write-Host "步骤2: 测试用授权码换取JWT令牌..." -ForegroundColor Yellow
try {
    $tokenBody = @{
        code = $authCode
        state = $returnedState
        redirect_uri = $redirectUri
    } | ConvertTo-Json

    $tokenResponse = Invoke-RestMethod -Uri "$serverUrl/api/vscode/callback" -Method POST -ContentType "application/json" -Body $tokenBody
    
    Write-Host "✅ JWT令牌获取成功!" -ForegroundColor Green
    Write-Host "   令牌: $($tokenResponse.access_token.Substring(0,50))..." -ForegroundColor Cyan
    Write-Host "   用户ID: $($tokenResponse.account.id)" -ForegroundColor Cyan
    Write-Host "   用户名: $($tokenResponse.account.label)" -ForegroundColor Cyan
    
    $accessToken = $tokenResponse.access_token
} catch {
    Write-Host "❌ JWT令牌获取失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 测试3: 使用JWT令牌获取用户信息
Write-Host "步骤3: 测试使用JWT令牌获取用户信息..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = "Bearer $accessToken"
    }

    $userResponse = Invoke-RestMethod -Uri "$serverUrl/api/vscode/user" -Method GET -Headers $headers
    
    Write-Host "✅ 用户信息获取成功!" -ForegroundColor Green
    Write-Host "   用户名: $($userResponse.username)" -ForegroundColor Cyan
    Write-Host "   邮箱: $($userResponse.email)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 用户信息获取失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== 所有测试通过! ===" -ForegroundColor Green
Write-Host ""
Write-Host "简化流程总结:" -ForegroundColor White
Write-Host "1. 用户登录 → 直接获得授权码" -ForegroundColor Gray
Write-Host "2. VSCode扩展用授权码换取JWT令牌" -ForegroundColor Gray  
Write-Host "3. 使用JWT令牌访问API" -ForegroundColor Gray
Write-Host ""
Write-Host "现在可以在VSCode中测试完整的身份验证流程了!" -ForegroundColor Green
