@echo off
chcp 65001 >nul
title 立刻更新资料库
cd /d "%~dp0"
echo ============================================
echo   立刻更新资料库
echo   抓最新岗位 - 重新加密 - 推送上线
echo   约 5-8 分钟，窗口不要关
echo ============================================
echo.
python scripts\refresh-vault.py
if %errorlevel% neq 0 (
    echo.
    echo [X] 没有成功，请把上面的报错截图发给贾维斯。
    pause
    exit /b 1
)
echo.
echo 完成！手机或任意电脑打开：
echo https://xmstores.com/vault.html
pause
