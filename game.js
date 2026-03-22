// 三国融合：群英卡牌战 - 主游戏类
class ThreeKingdomsGame {
    constructor() {
        this.currentScreen = 'main-menu';
        this.gameData = null;
        this.battleData = null;
        this.init();
    }

    init() {
        this.initializeGameData();
        this.bindEvents();
        this.showScreen('main-menu');
    }

    // 游戏数据初始化
    initializeGameData() {
        this.gameData = {
            player: {
                faction: '蜀',
                gold: 1000,
                food: 1000,
                troops: 100,
                turn: 1
            },
            cities: [
                {
                    id: 1,
                    name: '成都',
                    population: 50000,
                    tax: 100,
                    foodProduction: 50,
                    defense: 80,
                    general: null
                },
                {
                    id: 2,
                    name: '汉中',
                    population: 30000,
                    tax: 60,
                    foodProduction: 40,
                    defense: 60,
                    general: null
                }
            ],
            generals: [
                {
                    id: 1,
                    name: '刘备',
                    leadership: 95,
                    force: 65,
                    intelligence: 85,
                    politics: 88,
                    cost: 200,
                    loyalty: 100,
                    assignedCity: null,
                    cards: ['杀', '闪', '桃']
                },
                {
                    id: 2,
                    name: '关羽',
                    leadership: 88,
                    force: 97,
                    intelligence: 75,
                    politics: 70,
                    cost: 180,
                    loyalty: 95,
                    assignedCity: null,
                    cards: ['杀', '杀', '闪', '桃']
                },
                {
                    id: 3,
                    name: '张飞',
                    leadership: 82,
                    force: 98,
                    intelligence: 65,
                    politics: 60,
                    cost: 170,
                    loyalty: 90,
                    assignedCity: null,
                    cards: ['杀', '杀', '杀', '闪']
                }
            ],
            availableGenerals: [
                {
                    id: 4,
                    name: '诸葛亮',
                    leadership: 96,
                    force: 45,
                    intelligence: 100,
                    politics: 95,
                    cost: 250,
                    loyalty: 100,
                    cards: ['桃', '无中生有', '顺手牵羊', '过河拆桥']
                },
                {
                    id: 5,
                    name: '赵云',
                    leadership: 85,
                    force: 96,
                    intelligence: 80,
                    politics: 75,
                    cost: 190,
                    loyalty: 95,
                    cards: ['杀', '闪', '桃', '无中生有']
                }
            ],
            enemies: [
                {
                    name: '曹操',
                    leadership: 94,
                    force: 72,
                    intelligence: 91,
                    politics: 96,
                    cards: ['杀', '杀', '闪', '桃', '无中生有']
                },
                {
                    name: '张辽',
                    leadership: 88,
                    force: 92,
                    intelligence: 78,
                    politics: 75,
                    cards: ['杀', '杀', '闪', '桃']
                }
            ]
        };
    }

    // 屏幕切换
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // 根据屏幕更新内容
            if (screenId === 'domestic-screen') {
                this.updateDomesticScreen();
            } else if (screenId === 'battle-screen') {
                this.initBattleScreen();
            }
        }
    }

    // 新游戏
    newGame() {
        this.initializeGameData();
        this.showScreen('domestic-screen');
        this.addBattleLog('游戏开始！欢迎来到三国时代！');
    }

    // 继续游戏
    loadGame() {
        const savedGame = localStorage.getItem('threeKingdomsSave');
        if (savedGame) {
            this.gameData = JSON.parse(savedGame);
            this.showScreen('domestic-screen');
            this.addBattleLog('游戏已加载！');
        } else {
            alert('没有找到存档！');
        }
    }

    // 保存游戏
    saveGame() {
        localStorage.setItem('threeKingdomsSave', JSON.stringify(this.gameData));
        this.addBattleLog('游戏已保存！');
    }

    // 更新内政界面
    updateDomesticScreen() {
        this.updateResources();
        this.updateCities();
        this.updateGenerals();
        this.updateFactionInfo();
    }

    // 更新资源显示
    updateResources() {
        document.getElementById('gold').textContent = this.gameData.player.gold;
        document.getElementById('food').textContent = this.gameData.player.food;
        document.getElementById('troops').textContent = this.gameData.player.troops;
        document.getElementById('turn').textContent = this.gameData.player.turn;
    }

    // 更新城市列表
    updateCities() {
        const cityList = document.getElementById('city-list');
        cityList.innerHTML = '';
        
        this.gameData.cities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.className = 'city-item';
            cityElement.innerHTML = `
                <h4>${city.name}</h4>
                <div>人口: ${city.population.toLocaleString()}</div>
                <div>税收: ${city.tax} 金币/回合</div>
                <div>粮食: ${city.foodProduction} 粮食/回合</div>
                <div>防御: ${city.defense}</div>
                ${city.general ? `<div>守将: ${city.general}</div>` : '<div>无守将</div>'}
            `;
            cityElement.onclick = () => this.showCityDetail(city);
            cityList.appendChild(cityElement);
        });
    }

    // 更新武将列表
    updateGenerals() {
        const generalList = document.getElementById('general-list');
        generalList.innerHTML = '';
        
        this.gameData.generals.forEach(general => {
            const generalElement = document.createElement('div');
            generalElement.className = 'general-item';
            generalElement.innerHTML = `
                <h4>${general.name}</h4>
                <div>统率: ${general.leadership}</div>
                <div>武力: ${general.force}</div>
                <div>智力: ${general.intelligence}</div>
                <div>政治: ${general.politics}</div>
                <div>忠诚: ${general.loyalty}</div>
                ${general.assignedCity ? `<div>驻守: ${general.assignedCity}</div>` : '<div>未驻守</div>'}
            `;
            generalElement.onclick = () => this.showGeneralDetail(general);
            generalList.appendChild(generalElement);
        });
    }

    // 更新势力信息
    updateFactionInfo() {
        const factionInfo = document.getElementById('faction-info');
        const totalForce = this.gameData.generals.reduce((sum, g) => sum + g.force, 0);
        const totalLeadership = this.gameData.generals.reduce((sum, g) => sum + g.leadership, 0);
        const totalIntelligence = this.gameData.generals.reduce((sum, g) => sum + g.intelligence, 0);
        
        factionInfo.innerHTML = `
            <div><strong>势力: ${this.gameData.player.faction}</strong></div>
            <div>总武力: ${totalForce}</div>
            <div>总统率: ${totalLeadership}</div>
            <div>总智力: ${totalIntelligence}</div>
            <div>武将数量: ${this.gameData.generals.length}</div>
            <div>城市数量: ${this.gameData.cities.length}</div>
        `;
    }

    // 招募武将
    recruitGeneral() {
        if (this.gameData.availableGenerals.length === 0) {
            alert('没有可招募的武将！');
            return;
        }
        
        const general = this.gameData.availableGenerals[0];
        if (this.gameData.player.gold >= general.cost) {
            this.gameData.player.gold -= general.cost;
            this.gameData.generals.push(general);
            this.gameData.availableGenerals.shift();
            this.updateDomesticScreen();
            this.addBattleLog(`成功招募 ${general.name}！`);
        } else {
            alert('金币不足！');
        }
    }

    // 指派武将
    assignGeneral() {
        const unassignedGenerals = this.gameData.generals.filter(g => !g.assignedCity);
        const citiesWithoutGeneral = this.gameData.cities.filter(c => !c.general);
        
        if (unassignedGenerals.length === 0) {
            alert('没有空闲的武将！');
            return;
        }
        
        if (citiesWithoutGeneral.length === 0) {
            alert('所有城市都有守将！');
            return;
        }
        
        const general = unassignedGenerals[0];
        const city = citiesWithoutGeneral[0];
        
        general.assignedCity = city.name;
        city.general = general.name;
        
        this.updateDomesticScreen();
        this.addBattleLog(`${general.name} 已被指派到 ${city.name}！`);
    }

    // 下一回合
    nextTurn() {
        this.gameData.player.turn++;
        
        // 收取税收和粮食
        this.gameData.cities.forEach(city => {
            this.gameData.player.gold += city.tax;
            this.gameData.player.food += city.foodProduction;
        });
        
        this.updateDomesticScreen();
        this.addBattleLog(`第 ${this.gameData.player.turn} 回合开始！`);
        this.saveGame();
    }

    // 开始战斗
    startBattle() {
        const enemy = this.gameData.enemies[Math.floor(Math.random() * this.gameData.enemies.length)];
        const playerGeneral = this.gameData.generals[Math.floor(Math.random() * this.gameData.generals.length)];
        
        this.battleData = {
            player: {
                general: playerGeneral,
                hp: 100,
                maxHp: 100,
                hand: [],
                usedCards: []
            },
            enemy: {
                general: enemy,
                hp: 100,
                maxHp: 100,
                hand: []
            },
            currentTurn: 'player',
            phase: 'draw',
            battleTurn: 1
        };
        
        this.showScreen('battle-screen');
    }

    // 初始化战斗界面
    initBattleScreen() {
        if (!this.battleData) return;
        
        // 更新武将信息
        this.updateBattleGeneralInfo();
        
        // 发牌
        this.dealCards();
        
        // 更新战斗信息
        this.updateBattleInfo();
        
        // 玩家先手
        this.startPlayerTurn();
    }

    // 更新战斗中的武将信息
    updateBattleGeneralInfo() {
        const playerGeneralDiv = document.querySelector('#player-general .general-stats');
        const enemyGeneralDiv = document.querySelector('#enemy-general .general-stats');
        
        playerGeneralDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">${this.battleData.player.general.name}</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${this.battleData.player.hp}/${this.battleData.player.maxHp}</span>
                <span class="stat-label">HP</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${this.battleData.player.general.force}</span>
                <span class="stat-label">武力</span>
            </div>
        `;
        
        enemyGeneralDiv.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">${this.battleData.enemy.general.name}</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${this.battleData.enemy.hp}/${this.battleData.enemy.maxHp}</span>
                <span class="stat-label">HP</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${this.battleData.enemy.general.force}</span>
                <span class="stat-label">武力</span>
            </div>
        `;
    }

    // 发牌
    dealCards() {
        // 玩家手牌
        this.battleData.player.hand = [
            '杀', '闪', '桃', '杀', '闪'
        ];
        
        // 敌人手牌
        this.battleData.enemy.hand = [
            '杀', '闪', '桃', '杀'
        ];
        
        this.renderPlayerHand();
        this.renderEnemyHand();
    }

    // 渲染玩家手牌
    renderPlayerHand() {
        const handArea = document.getElementById('player-hand');
        handArea.innerHTML = '';
        
        this.battleData.player.hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            handArea.appendChild(cardElement);
        });
    }

    // 渲染敌人手牌
    renderEnemyHand() {
        const handArea = document.getElementById('enemy-hand');
        handArea.innerHTML = '';
        
        this.battleData.enemy.hand.forEach(() => {
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            handArea.appendChild(cardBack);
        });
    }

    // 创建卡牌元素
    createCardElement(cardName, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = index;
        cardDiv.onclick = () => this.useCard(index);
        
        const cardInfo = this.getCardInfo(cardName);
        
        cardDiv.innerHTML = `
            <div class="card-cost">${cardInfo.cost}</div>
            <div class="card-name">${cardName}</div>
            <div class="card-type">${cardInfo.type}</div>
            <div class="card-effect">${cardInfo.effect}</div>
        `;
        
        return cardDiv;
    }

    // 获取卡牌信息
    getCardInfo(cardName) {
        const cardDatabase = {
            '杀': { cost: 1, type: '攻击', effect: '造成2点伤害' },
            '闪': { cost: 1, type: '防御', effect: '抵消一次攻击' },
            '桃': { cost: 1, type: '回复', effect: '恢复2点生命' },
            '无中生有': { cost: 2, type: '策略', effect: '摸2张牌' },
            '顺手牵羊': { cost: 1, type: '策略', effect: '获得对方1张牌' },
            '过河拆桥': { cost: 1, type: '策略', effect: '弃置对方1张牌' }
        };
        
        return cardDatabase[cardName] || { cost: 1, type: '未知', effect: '未知效果' };
    }

    // 玩家回合开始
    startPlayerTurn() {
        this.battleData.currentTurn = 'player';
        this.battleData.phase = 'draw';
        this.updateBattleInfo();
        this.addBattleLog('你的回合开始！');
        
        // 抽牌阶段
        setTimeout(() => {
            this.drawPhase();
        }, 1000);
    }

    // 抽牌阶段
    drawPhase() {
        this.battleData.phase = 'draw';
        this.updateBattleInfo();
        
        // 摸一张牌
        const newCards = ['杀', '闪', '桃', '无中生有', '顺手牵羊', '过河拆桥'];
        const randomCard = newCards[Math.floor(Math.random() * newCards.length)];
        this.battleData.player.hand.push(randomCard);
        
        this.renderPlayerHand();
        this.addBattleLog('你摸了一张牌');
        
        // 进入主阶段
        setTimeout(() => {
            this.mainPhase();
        }, 1000);
    }

    // 主阶段
    mainPhase() {
        this.battleData.phase = 'main';
        this.updateBattleInfo();
        this.addBattleLog('主阶段 - 可以使用卡牌');
    }

    // 使用卡牌
    useCard(cardIndex) {
        if (this.battleData.currentTurn !== 'player' || this.battleData.phase !== 'main') {
            return;
        }
        
        const card = this.battleData.player.hand[cardIndex];
        this.executeCardEffect(card, 'player', cardIndex);
    }

    // 执行卡牌效果
    executeCardEffect(cardName, user, cardIndex) {
        const target = user === 'player' ? this.battleData.enemy : this.battleData.player;
        const user_data = user === 'player' ? this.battleData.player : this.battleData.enemy;
        
        switch(cardName) {
            case '杀':
                const damage = 2;
                target.hp = Math.max(0, target.hp - damage);
                this.addBattleLog(`${user_data.general.name} 使用【杀】造成 ${damage} 点伤害`);
                break;
                
            case '桃':
                const heal = 2;
                user_data.hp = Math.min(user_data.maxHp, user_data.hp + heal);
                this.addBattleLog(`${user_data.general.name} 使用【桃】恢复 ${heal} 点生命`);
                break;
                
            case '闪':
                this.addBattleLog(`${user_data.general.name} 使用【闪】准备防御`);
                break;
                
            case '无中生有':
                const newCards = ['杀', '闪', '桃'];
                for (let i = 0; i < 2; i++) {
                    const randomCard = newCards[Math.floor(Math.random() * newCards.length)];
                    user_data.hand.push(randomCard);
                }
                this.addBattleLog(`${user_data.general.name} 使用【无中生有】摸2张牌`);
                if (user === 'player') {
                    this.renderPlayerHand();
                }
                break;
        }
        
        // 移除使用的卡牌
        if (cardIndex !== undefined) {
            user_data.hand.splice(cardIndex, 1);
            if (user === 'player') {
                this.renderPlayerHand();
            }
        }
        
        // 更新武将信息
        this.updateBattleGeneralInfo();
        
        // 检查战斗是否结束
        if (this.checkBattleEnd()) {
            return;
        }
    }

    // 敌人AI回合
    enemyTurn() {
        this.battleData.currentTurn = 'enemy';
        this.battleData.phase = 'draw';
        this.updateBattleInfo();
        this.addBattleLog(`${this.battleData.enemy.general.name} 的回合开始`);
        
        setTimeout(() => {
            // 敌人摸牌
            const newCards = ['杀', '闪', '桃'];
            const randomCard = newCards[Math.floor(Math.random() * newCards.length)];
            this.battleData.enemy.hand.push(randomCard);
            
            this.addBattleLog(`${this.battleData.enemy.general.name} 摸了一张牌`);
            
            setTimeout(() => {
                this.battleData.phase = 'main';
                this.updateBattleInfo();
                this.enemyAction();
            }, 1000);
        }, 1000);
    }

    // 敌人行动
    enemyAction() {
        // 简单AI：随机使用一张牌
        if (this.battleData.enemy.hand.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.battleData.enemy.hand.length);
            const card = this.battleData.enemy.hand[randomIndex];
            
            // AI优先级：血量低时用桃，血量高时用杀
            if (this.battleData.enemy.hp < 50) {
                const peachIndex = this.battleData.enemy.hand.indexOf('桃');
                if (peachIndex !== -1) {
                    this.executeCardEffect('桃', 'enemy', peachIndex);
                    this.endEnemyTurn();
                    return;
                }
            }
            
            this.executeCardEffect(card, 'enemy', randomIndex);
        }
        
        setTimeout(() => {
            this.endEnemyTurn();
        }, 2000);
    }

    // 结束敌人回合
    endEnemyTurn() {
        this.battleData.battleTurn++;
        this.updateBattleInfo();
        
        if (!this.checkBattleEnd()) {
            setTimeout(() => {
                this.startPlayerTurn();
            }, 1000);
        }
    }

    // 结束阶段
    endPhase() {
        if (this.battleData.currentTurn !== 'player') return;
        
        this.addBattleLog('结束回合');
        setTimeout(() => {
            this.enemyTurn();
        }, 1000);
    }

    // 检查战斗是否结束
    checkBattleEnd() {
        if (this.battleData.player.hp <= 0) {
            this.endBattle(false);
            return true;
        } else if (this.battleData.enemy.hp <= 0) {
            this.endBattle(true);
            return true;
        }
        return false;
    }

    // 结束战斗
    endBattle(victory) {
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const stats = document.querySelector('.game-over-stats');
        
        if (victory) {
            title.textContent = '胜利！';
            message.textContent = `你击败了 ${this.battleData.enemy.general.name}！`;
            
            // 奖励
            const goldReward = 100;
            this.gameData.player.gold += goldReward;
            stats.innerHTML = `
                <div>获得奖励：${goldReward} 金币</div>
                <div>剩余生命：${this.battleData.player.hp}/${this.battleData.player.maxHp}</div>
            `;
        } else {
            title.textContent = '战败！';
            message.textContent = `你被 ${this.battleData.enemy.general.name} 击败了！`;
            stats.innerHTML = `
                <div>战斗失败，损失了一些资源</div>
            `;
            
            // 惩罚
            this.gameData.player.gold = Math.max(0, this.gameData.player.gold - 50);
            this.gameData.player.food = Math.max(0, this.gameData.player.food - 50);
        }
        
        setTimeout(() => {
            this.showScreen('game-over-screen');
        }, 2000);
    }

    // 更新战斗信息
    updateBattleInfo() {
        document.getElementById('battle-turn').textContent = this.battleData.battleTurn;
        
        const phaseNames = {
            'draw': '摸牌阶段',
            'main': '主阶段',
            'end': '结束阶段'
        };
        
        const turnName = this.battleData.currentTurn === 'player' ? '你的' : '敌人';
        document.getElementById('phase-indicator').textContent = `${turnName}${phaseNames[this.battleData.phase]}`;
    }

    // 添加战斗日志
    addBattleLog(message) {
        const logElement = document.getElementById('battle-log');
        if (logElement) {
            const time = new Date().toLocaleTimeString();
            logElement.innerHTML += `<div>[${time}] ${message}</div>`;
            logElement.scrollTop = logElement.scrollHeight;
        }
    }

    // 显示游戏说明
    showInstructions() {
        this.showScreen('instructions-screen');
        this.showTab('domestic');
    }

    // 显示说明标签页
    showTab(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新内容
        const content = document.getElementById('instruction-content');
        const contents = {
            domestic: `
                <h3>内政系统</h3>
                <h4>城市管理</h4>
                <ul>
                    <li><strong>税收</strong>：每个城市每回合产生金币收入</li>
                    <li><strong>粮食生产</strong>：每个城市每回合产生粮食</li>
                    <li><strong>防御</strong>：城市的防御能力</li>
                    <li><strong>人口</strong>：影响税收和征兵</li>
                </ul>
                
                <h4>武将管理</h4>
                <ul>
                    <li><strong>招募武将</strong>：花费金币招募新武将</li>
                    <li><strong>指派武将</strong>：将武将驻守到城市</li>
                    <li><strong>武将属性</strong>：
                        <ul>
                            <li>统率：影响军队指挥</li>
                            <li>武力：影响战斗能力</li>
                            <li>智力：影响策略使用</li>
                            <li>政治：影响内政管理</li>
                        </ul>
                    </li>
                </ul>
                
                <h4>资源管理</h4>
                <ul>
                    <li><strong>金币</strong>：用于招募武将、建设</li>
                    <li><strong>粮食</strong>：维持军队和民生</li>
                    <li><strong>兵力</strong>：用于战争和防御</li>
                </ul>
            `,
            battle: `
                <h3>卡牌战斗系统</h3>
                <h4>战斗流程</h4>
                <ol>
                    <li><strong>摸牌阶段</strong>：摸取一张手牌</li>
                    <li><strong>主阶段</strong>：使用手牌进行战斗</li>
                    <li><strong>结束阶段</strong>：结束回合，对方开始行动</li>
                </ol>
                
                <h4>战斗规则</h4>
                <ul>
                    <li>每个武将初始生命值为100</li>
                    <li>生命值降至0即战败</li>
                    <li>可以通过卡牌进行攻击、防御和回复</li>
                    <li>武将的武力值会影响战斗效果</li>
                </ul>
                
                <h4>策略技巧</h4>
                <ul>
                    <li>合理使用攻击和防御卡牌</li>
                    <li>及时回复生命值</li>
                    <li>观察敌人的行动模式</li>
                    <li>把握使用强力卡牌的时机</li>
                </ul>
            `,
            cards: `
                <h3>卡牌说明</h3>
                <h4>基本卡牌</h4>
                <ul>
                    <li><strong>杀</strong>：对敌人造成2点伤害</li>
                    <li><strong>闪</strong>：抵消一次攻击伤害</li>
                    <li><strong>桃</strong>：恢复2点生命值</li>
                </ul>
                
                <h4>策略卡牌</h4>
                <ul>
                    <li><strong>无中生有</strong>：摸2张手牌</li>
                    <li><strong>顺手牵羊</strong>：获得对方1张手牌</li>
                    <li><strong>过河拆桥</strong>：弃置对方1张手牌</li>
                </ul>
                
                <h4>卡牌费用</h4>
                <ul>
                    <li>每张卡牌左上角显示费用</li>
                    <li>基本卡牌费用为1</li>
                    <li>策略卡牌费用为1-2</li>
                    <li>需要在适当费用下使用</li>
                </ul>
                
                <h4>武将技能</h4>
                <ul>
                    <li>每个武将都有独特的技能</li>
                    <li>技能可以在战斗中使用</li>
                    <li>技能有冷却时间</li>
                    <li>合理使用技能是获胜关键</li>
                </ul>
            `
        };
        
        content.innerHTML = contents[tabName] || contents.domestic;
    }

    // 返回主菜单
    backToMenu() {
        this.showScreen('main-menu');
    }

    // 撤退
    retreat() {
        if (confirm('确定要撤退吗？撤退会被视为战败！')) {
            this.endBattle(false);
        }
    }

    // 使用技能
    useSkill() {
        alert('技能系统开发中...');
    }

    // 外交功能
    showDiplomacy() {
        alert('外交系统开发中...');
    }

    // 显示城市详情
    showCityDetail(city) {
        const modal = document.getElementById('card-detail-modal');
        const content = document.getElementById('card-detail-content');
        
        content.innerHTML = `
            <h3>${city.name} 详情</h3>
            <div>人口: ${city.population.toLocaleString()}</div>
            <div>税收: ${city.tax} 金币/回合</div>
            <div>粮食生产: ${city.foodProduction} 粮食/回合</div>
            <div>防御: ${city.defense}</div>
            <div>守将: ${city.general || '无'}</div>
        `;
        
        modal.style.display = 'block';
    }

    // 显示武将详情
    showGeneralDetail(general) {
        const modal = document.getElementById('general-detail-modal');
        const content = document.getElementById('general-detail-content');
        
        content.innerHTML = `
            <h3>${general.name} 详情</h3>
            <div>统率: ${general.leadership}</div>
            <div>武力: ${general.force}</div>
            <div>智力: ${general.intelligence}</div>
            <div>政治: ${general.politics}</div>
            <div>忠诚: ${general.loyalty}</div>
            <div>招募费用: ${general.cost} 金币</div>
            <div>驻守: ${general.assignedCity || '未驻守'}</div>
            <div>拥有卡牌: ${general.cards.join(', ')}</div>
        `;
        
        modal.style.display = 'block';
    }

    // 关闭模态框
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // 绑定事件
    bindEvents() {
        // 模态框关闭事件
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModal());
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'battle-screen') {
                switch(e.key) {
                    case 'Escape':
                        this.endPhase();
                        break;
                    case 's':
                        this.useSkill();
                        break;
                    case 'r':
                        this.retreat();
                        break;
                }
            }
        });
    }
}

// 游戏初始化
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new ThreeKingdomsGame();
});