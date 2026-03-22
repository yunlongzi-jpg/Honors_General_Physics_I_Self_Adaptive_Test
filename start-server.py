#!/usr/bin/env python3
"""
简单的HTTP服务器启动脚本
运行此脚本后，在浏览器中访问 http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头部，允许本地访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 服务器已启动!")
        print(f"📱 请在浏览器中访问: http://localhost:{PORT}")
        print(f"🌐 可访问的游戏:")
        print(f"   • 物理题智能体: http://localhost:{PORT}/physics-tutor.html")
        print(f"   • 三国融合游戏: http://localhost:{PORT}/sanguo-game.html")
        print(f"   • 国际象棋: http://localhost:{PORT}/chess.html")
        print(f"🛑 按 Ctrl+C 停止服务器")
        
        # 自动打开浏览器
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n👋 服务器已停止")

if __name__ == "__main__":
    start_server()