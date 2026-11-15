@echo off
chcp 65001 >nul
title 锦市 Jobs 一键上线
cd /d "%~dp0"

echo ============================================
echo    锦市 Jobs   一键上线
echo    自动同步 - 合并 - 推送 - 部署
echo    推送后 Vercel 自动上线 xmstores.com
echo ============================================
echo.
python scripts\publish.py
if %errorlevel% neq 0 (
    echo.
    echo [X] 没有推送成功，请把上面的报错截图发给贾维斯。
    pause
    exit /b 1
)
echo.
echo 打开网站: https://xmstores.com
start https://xmstores.com
pause
