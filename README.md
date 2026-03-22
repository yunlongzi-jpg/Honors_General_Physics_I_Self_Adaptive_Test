# 智能体游戏集合

这是一个包含多个智能体游戏的项目集合，包含物理题练习系统、三国融合游戏和国际象棋。

## 🎮 游戏列表

### 1. 物理题智能体 (`physics-tutor.html`)
- 智能难度调整的物理题练习系统
- 根据答题表现自动调整题目难度
- 支持选择题、填空题、公式题
- 实时进度跟踪和学习统计

### 2. 三国融合游戏 (`sanguo-game.html`)
- 结合三国群英传内政系统和三国杀卡牌战斗
- 城市管理、武将招募、资源管理
- 策略卡牌对战，AI对手
- 完整的游戏进度保存

### 3. 国际象棋 (`chess.html`)
- 完整的国际象棋规则实现
- 4级AI难度（简单、中等、困难、专家）
- Minimax算法 + Alpha-Beta剪枝
- 悔棋、提示、游戏统计功能

## 🚀 如何运行

### 方法一：使用Python服务器（推荐）

1. **确保安装了Python**：
   ```bash
   python --version
   ```
   如果没有安装，请从 [python.org](https://python.org) 下载

2. **启动服务器**：
   - **Windows用户**：双击 `start-server.bat`
   - **其他系统**：运行 `python start-server.py`

3. **访问游戏**：
   - 自动打开浏览器访问 http://localhost:8000
   - 或手动访问：
     - 物理题: http://localhost:8000/physics-tutor.html
     - 三国游戏: http://localhost:8000/sanguo-game.html
     - 国际象棋: http://localhost:8000/chess.html

### 方法二：使用Node.js服务器

如果你安装了Node.js：
```bash
npx http-server
```

### 方法三：使用VS Code Live Server

如果你使用VS Code：
1. 安装 "Live Server" 扩展
2. 右键HTML文件 → "Open with Live Server"

## 📁 文件说明

```
📦 项目文件夹
├── 🎮 physics-tutor.html    # 物理题智能体
├── ⚔️  sanguo-game.html      # 三国融合游戏
├── ♟️  chess.html            # 国际象棋
├── 🎨 styles.css            # 三国游戏样式
├── 🤖 script.js             # 物理题逻辑
├── 🧠 game.js               # 三国游戏逻辑
├── ♟️  chess.js              # 国际象棋逻辑
├── 🚀 start-server.py       # Python服务器脚本
├── 🚀 start-server.bat      # Windows启动脚本
└── 📖 README.md             # 说明文档
```

## 🎯 游戏特色

### 🔬 物理题智能体
- 自适应难度算法
- 多种题型支持
- 详细解题思路
- 学习进度追踪

### ⚔️ 三国融合
- 内政 + 卡牌玩法
- 丰富的武将系统
- 策略深度玩法
- 存档系统

### ♟️ 国际象棋
- 专业AI对手
- 完整规则实现
- 棋局分析功能
- 悔棋和提示

## 🔧 故障排除

### ERR_CONNECTION_REFUSED 错误
这是正常的，因为需要通过HTTP服务器访问，不能直接打开HTML文件。

**解决方案**：
1. 使用提供的 `start-server.bat`（Windows）或 `start-server.py`
2. 确保端口8000没有被占用
3. 在浏览器中访问 http://localhost:8000

### 端口被占用
如果8000端口被占用，可以修改服务器脚本中的端口号：
```python
PORT = 8080  # 改为其他端口
```

### 文件找不到
确保所有HTML、CSS、JS文件都在同一个文件夹中。

## 🎨 自定义

你可以轻松修改游戏：
- **样式**：编辑CSS文件
- **逻辑**：编辑JavaScript文件
- **内容**：修改HTML和JS中的数据

## 📞 支持

如果遇到问题：
1. 检查Python是否正确安装
2. 确保文件路径正确
3. 查看浏览器控制台错误信息

---

**享受游戏！** 🎮✨