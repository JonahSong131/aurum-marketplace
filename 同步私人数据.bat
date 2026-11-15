@echo off
chcp 65001 >nul
title 立刻更新资料库
cd /d "%~dp0"
echo 资料库现在会自动更新，这里为你立刻刷新一次。
echo.
call "立刻更新资料库.bat"
