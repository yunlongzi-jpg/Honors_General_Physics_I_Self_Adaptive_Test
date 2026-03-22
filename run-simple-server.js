// 简单的Node.js服务器
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 处理CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('🚀 服务器已启动!');
    console.log('📱 请在浏览器中访问: http://localhost:' + PORT);
    console.log('');
    console.log('🌐 可访问的游戏:');
    console.log('   • 游戏中心: http://localhost:' + PORT);
    console.log('   • 物理题智能体: http://localhost:' + PORT + '/physics-tutor.html');
    console.log('   • 三国融合游戏: http://localhost:' + PORT + '/sanguo-game.html');
    console.log('   • 国际象棋: http://localhost:' + PORT + '/chess.html');
    console.log('');
    console.log('🛑 按 Ctrl+C 停止服务器');

    // 尝试自动打开浏览器
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    setTimeout(() => {
        exec(`${start} http://localhost:${PORT}`, (error) => {
            if (error) {
                console.log('无法自动打开浏览器，请手动访问上述地址');
            }
        });
    }, 1000);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
        console.log('   解决方案1: 关闭占用端口的程序');
        console.log('   解决方案2: 修改此文件中的端口号');
    } else {
        console.log('❌ 服务器启动失败:', err);
    }
});