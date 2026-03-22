@echo off
chcp 65001 >nul
cls

echo ====================================
echo     🎮 智能体游戏快速启动器
echo ====================================
echo.

echo 🔍 检查系统中可用的服务器...
echo.

rem 检查Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python 已安装
    echo.
    echo 🚀 启动Python服务器...
    echo.
    echo 📱 浏览器将自动打开，访问地址: http://localhost:8000
    echo 🛑 按 Ctrl+C 停止服务器
    echo.
    pause
    python -m http.server 8000
    goto :end
)

rem 检查Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js 已安装
    echo.
    echo 🚀 启动Node.js服务器...
    echo.
    echo 📱 浏览器将自动打开，访问地址: http://localhost:8000
    echo 🛑 按 Ctrl+C 停止服务器
    echo.
    pause
    node run-simple-server.js
    goto :end
)

echo ❌ 未找到 Python 或 Node.js
echo.
echo 💡 请选择安装方式：
echo.
echo 方案1: 安装 Python
echo    访问: https://www.python.org/downloads/
echo    下载并安装后重新运行此脚本
echo.
echo 方案2: 直接打开游戏文件
echo    右键 .html 文件 → 用浏览器打开
echo    可能会有安全提示，选择"允许"或"继续"
echo.
echo 方案3: 使用在线编辑器
echo    将文件拖拽到 https://codepen.io
echo.

:end
if %errorlevel% neq 0 (
    echo.
    echo ❌ 服务器启动失败
    echo 💡 你可以直接双击 HTML 文件打开游戏
)
pause