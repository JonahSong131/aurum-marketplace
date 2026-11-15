@echo off
chcp 65001 >nul
title 立刻更新资料库
cd /d "%~dp0"
echo 岗位数据由网站自动更新，这里为你立刻刷新一次资料库。
echo.
call "立刻更新资料库.bat"
