// 智能物理题练习系统
class PhysicsTutor {
    constructor() {
        this.currentDifficulty = 'easy';
        this.streak = 0;
        this.totalQuestions = 0;
        this.correctAnswers = 0;
        this.currentQuestion = null;
        this.userHistory = [];
        this.sessionId = Date.now();
        
        // 题库数据结构
        this.questionBank = {
            kinematics: {
                easy: [
                    {
                        id: 'kin_e1',
                        type: 'multiple_choice',
                        question: '一个物体从静止开始做匀加速直线运动，加速度为 2 m/s²，3秒后的速度是多少？',
                        options: ['6 m/s', '3 m/s', '9 m/s', '12 m/s'],
                        correct: 0,
                        explanation: '根据速度公式 v = v₀ + at，其中 v₀ = 0，a = 2 m/s²，t = 3s，所以 v = 0 + 2×3 = 6 m/s'
                    },
                    {
                        id: 'kin_e2',
                        type: 'input',
                        question: '汽车以 20 m/s 的速度行驶，刹车后加速度为 -4 m/s²，需要多少秒才能停止？',
                        answer: '5',
                        unit: 's',
                        explanation: '使用速度公式 v = v₀ + at，末速度 v = 0，所以 0 = 20 + (-4)t，解得 t = 5s'
                    }
                ],
                medium: [
                    {
                        id: 'kin_m1',
                        type: 'multiple_choice',
                        question: '一个球从 20m 高处自由落下，不计空气阻力，落地时的速度是多少？(g = 10 m/s²)',
                        options: ['10 m/s', '20 m/s', '30 m/s', '40 m/s'],
                        correct: 1,
                        explanation: '使用自由落体公式 v² = v₀² + 2gh，v₀ = 0，h = 20m，g = 10m/s²，所以 v² = 2×10×20 = 400，v = 20 m/s'
                    },
                    {
                        id: 'kin_m2',
                        type: 'input',
                        question: '物体做匀减速直线运动，初速度为 15 m/s，加速度为 -3 m/s²，5秒内通过的位移是多少？',
                        answer: '37.5',
                        unit: 'm',
                        explanation: '使用位移公式 s = v₀t + ½at²，s = 15×5 + ½×(-3)×25 = 75 - 37.5 = 37.5m'
                    }
                ],
                hard: [
                    {
                        id: 'kin_h1',
                        type: 'multiple_choice',
                        question: '一个物体从地面抛出，初速度为 20 m/s，与水平方向成 60° 角，最大高度是多少？(g = 10 m/s²)',
                        options: ['15 m', '20 m', '25 m', '30 m'],
                        correct: 0,
                        explanation: '最大高度 H = v₀²sin²θ/(2g) = 20²×(√3/2)²/(2×10) = 400×3/4/20 = 15m'
                    }
                ]
            },
            dynamics: {
                easy: [
                    {
                        id: 'dyn_e1',
                        type: 'multiple_choice',
                        question: '质量为 2kg 的物体受到 10N 的恒力作用，产生的加速度是多少？',
                        options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'],
                        correct: 1,
                        explanation: '根据牛顿第二定律 F = ma，所以 a = F/m = 10/2 = 5 m/s²'
                    },
                    {
                        id: 'dyn_e2',
                        type: 'input',
                        question: '一个 5kg 的物体在光滑水平面上，受到 15N 的推力，加速度是多少？',
                        answer: '3',
                        unit: 'm/s²',
                        explanation: '根据牛顿第二定律 a = F/m = 15/5 = 3 m/s²'
                    }
                ],
                medium: [
                    {
                        id: 'dyn_m1',
                        type: 'multiple_choice',
                        question: '质量为 10kg 的物体放在倾角为 30° 的斜面上，摩擦系数为 0.1，物体下滑的加速度是多少？(g = 10 m/s²)',
                        options: ['3.4 m/s²', '4.2 m/s²', '5.0 m/s²', '5.8 m/s²'],
                        correct: 1,
                        explanation: '重力分量 F₁ = mgsin30° = 50N，摩擦力 f = μmgcos30° = 0.1×100×0.866 = 8.66N，合力 F = 50 - 8.66 = 41.34N，a = 41.34/10 = 4.13 m/s² ≈ 4.2 m/s²'
                    }
                ],
                hard: [
                    {
                        id: 'dyn_h1',
                        type: 'input',
                        question: '一个系统由两个通过轻绳连接的物体组成，m₁=2kg 在水平面上，m₂=3kg 悬挂，摩擦系数为 0.2，系统加速度是多少？(g = 10 m/s²)',
                        answer: '4',
                        unit: 'm/s²',
                        explanation: '对 m₂：T - m₂g = -m₂a，对 m₁：T - μm₁g = m₁a，解得 a = (m₂g - μm₁g)/(m₁+m₂) = (30-4)/(5) = 5.2 m/s²'
                    }
                ]
            },
            energy: {
                easy: [
                    {
                        id: 'ene_e1',
                        type: 'multiple_choice',
                        question: '质量为 2kg 的物体从 10m 高处落下到地面，重力势能减少了多少？(g = 10 m/s²)',
                        options: ['20 J', '100 J', '200 J', '400 J'],
                        correct: 2,
                        explanation: '重力势能减少量 ΔEp = mgh = 2×10×10 = 200 J'
                    }
                ],
                medium: [
                    {
                        id: 'ene_m1',
                        type: 'multiple_choice',
                        question: '一个 1kg 的物体以 10 m/s 的速度运动，动能是多少？',
                        options: ['10 J', '50 J', '100 J', '200 J'],
                        correct: 1,
                        explanation: '动能 Ek = ½mv² = ½×1×10² = 50 J'
                    }
                ],
                hard: [
                    {
                        id: 'ene_h1',
                        type: 'input',
                        question: '从 20m 高处自由落下的物体，落地时速度是多少？(g = 10 m/s²，不计空气阻力)',
                        answer: '20',
                        unit: 'm/s',
                        explanation: '根据机械能守恒：mgh = ½mv²，所以 v = √(2gh) = √(2×10×20) = √400 = 20 m/s'
                    }
                ]
            }
        };
        
        this.categories = Object.keys(this.questionBank);
        this.difficulties = ['easy', 'medium', 'hard'];
        this.difficultyNames = {
            easy: '简单',
            medium: '中等',
            hard: '困难'
        };
        
        this.init();
    }
    
    init() {
        this.loadUserProgress();
        this.bindEvents();
        this.displayNewQuestion();
        this.updateStats();
    }
    
    loadUserProgress() {
        const saved = localStorage.getItem('physicsTutorProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.totalQuestions = progress.totalQuestions || 0;
            this.correctAnswers = progress.correctAnswers || 0;
            this.userHistory = progress.userHistory || [];
        }
    }
    
    saveUserProgress() {
        const progress = {
            totalQuestions: this.totalQuestions,
            correctAnswers: this.correctAnswers,
            userHistory: this.userHistory.slice(-50) // 只保存最近50题的历史
        };
        localStorage.setItem('physicsTutorProgress', JSON.stringify(progress));
    }
    
    bindEvents() {
        // 多选题选项点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectOption(e.target);
            }
        });
        
        // 提交答案按钮
        document.getElementById('submit-input').addEventListener('click', () => {
            this.submitInputAnswer();
        });
        
        document.getElementById('submit-formula').addEventListener('click', () => {
            this.submitFormulaAnswer();
        });
        
        // 回车键提交
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitInputAnswer();
        });
        
        document.getElementById('formula-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitFormulaAnswer();
        });
        
        // 控制按钮
        document.getElementById('next-question').addEventListener('click', () => {
            this.displayNewQuestion();
        });
        
        document.getElementById('new-session').addEventListener('click', () => {
            this.newSession();
        });
        
        document.getElementById('hint').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('skip').addEventListener('click', () => {
            this.skipQuestion();
        });
        
        // 公式符号按钮
        document.querySelectorAll('.formula-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('formula-answer');
                input.value += btn.dataset.symbol;
            });
        });
    }
    
    displayNewQuestion() {
        this.currentQuestion = this.selectQuestion();
        this.renderQuestion();
        this.clearFeedback();
        this.hideNextButton();
    }
    
    selectQuestion() {
        // 根据当前难度选择一个随机的类别和题目
        const availableCategories = this.categories.filter(cat => 
            this.questionBank[cat][this.currentDifficulty].length > 0
        );
        
        if (availableCategories.length === 0) {
            // 如果当前难度没有题目，调整难度
            this.adjustDifficultyLevel(false);
            return this.selectQuestion();
        }
        
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const questions = this.questionBank[category][this.currentDifficulty];
        const question = questions[Math.floor(Math.random() * questions.length)];
        
        question.category = category;
        question.difficulty = this.currentDifficulty;
        
        return question;
    }
    
    renderQuestion() {
        const questionText = document.getElementById('question-text');
        const questionCategory = document.getElementById('question-category');
        const questionDifficulty = document.getElementById('question-difficulty');
        
        questionText.textContent = this.currentQuestion.question;
        questionCategory.textContent = this.getCategoryName(this.currentQuestion.category);
        questionDifficulty.textContent = this.difficultyNames[this.currentDifficulty];
        
        // 设置难度颜色
        questionDifficulty.className = '';
        if (this.currentDifficulty === 'medium') questionDifficulty.classList.add('medium');
        if (this.currentDifficulty === 'hard') questionDifficulty.classList.add('hard');
        
        // 根据题目类型显示不同的输入界面
        this.displayQuestionOptions();
    }
    
    getCategoryName(category) {
        const names = {
            kinematics: '运动学',
            dynamics: '动力学',
            energy: '能量'
        };
        return names[category] || category;
    }
    
    displayQuestionOptions() {
        // 隐藏所有选项界面
        document.getElementById('multiple-choice').style.display = 'none';
        document.getElementById('input-answer').style.display = 'none';
        document.getElementById('formula-input').style.display = 'none';
        
        if (this.currentQuestion.type === 'multiple_choice') {
            this.displayMultipleChoice();
        } else if (this.currentQuestion.type === 'input' || this.currentQuestion.type === 'formula') {
            this.displayInputInterface();
        }
    }
    
    displayMultipleChoice() {
        const container = document.getElementById('multiple-choice');
        container.style.display = 'block';
        container.innerHTML = '';
        
        this.currentQuestion.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.dataset.index = index;
            container.appendChild(btn);
        });
    }
    
    displayInputInterface() {
        if (this.currentQuestion.type === 'formula') {
            document.getElementById('formula-input').style.display = 'block';
        } else {
            document.getElementById('input-answer').style.display = 'block';
        }
    }
    
    selectOption(button) {
        // 移除其他选项的选中状态
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
        // 自动检查答案
        const selectedIndex = parseInt(button.dataset.index);
        this.checkAnswer(selectedIndex);
    }
    
    submitInputAnswer() {
        const input = document.getElementById('answer-input');
        const answer = input.value.trim();
        
        if (!answer) return;
        
        this.checkAnswer(answer);
        input.value = '';
    }
    
    submitFormulaAnswer() {
        const input = document.getElementById('formula-answer');
        const answer = input.value.trim();
        
        if (!answer) return;
        
        this.checkAnswer(answer);
        input.value = '';
    }
    
    checkAnswer(userAnswer) {
        const correct = this.isAnswerCorrect(userAnswer);
        this.totalQuestions++;
        
        if (correct) {
            this.correctAnswers++;
            this.streak++;
            this.showFeedback(true);
            this.adjustDifficulty(true);
        } else {
            this.streak = 0;
            this.showFeedback(false);
            this.adjustDifficulty(false);
        }
        
        // 记录答题历史
        this.userHistory.push({
            questionId: this.currentQuestion.id,
            correct: correct,
            difficulty: this.currentDifficulty,
            category: this.currentQuestion.category,
            timestamp: Date.now()
        });
        
        this.saveUserProgress();
        this.updateStats();
        this.showNextButton();
    }
    
    isAnswerCorrect(userAnswer) {
        if (this.currentQuestion.type === 'multiple_choice') {
            return userAnswer === this.currentQuestion.correct;
        } else {
            // 数值答案容错处理
            const correctAnswer = parseFloat(this.currentQuestion.answer);
            const userAnswerNum = parseFloat(userAnswer);
            
            if (isNaN(userAnswerNum)) return false;
            
            // 允许小的数值误差
            const tolerance = Math.abs(correctAnswer) * 0.01 + 0.1;
            return Math.abs(userAnswerNum - correctAnswer) <= tolerance;
        }
    }
    
    adjustDifficulty(isCorrect) {
        const oldDifficulty = this.currentDifficulty;
        
        if (isCorrect) {
            // 答对了，可能提升难度
            if (this.streak >= 2) {
                if (this.currentDifficulty === 'easy') {
                    this.currentDifficulty = 'medium';
                } else if (this.currentDifficulty === 'medium' && this.streak >= 3) {
                    this.currentDifficulty = 'hard';
                }
            }
        } else {
            // 答错了，降低难度
            if (this.currentDifficulty === 'hard') {
                this.currentDifficulty = 'medium';
            } else if (this.currentDifficulty === 'medium') {
                this.currentDifficulty = 'easy';
            }
        }
        
        // 如果难度改变，显示提示
        if (oldDifficulty !== this.currentDifficulty) {
            const changeMessage = isCorrect ? 
                `连续答对！难度提升至${this.difficultyNames[this.currentDifficulty]}` :
                `难度降低至${this.difficultyNames[this.currentDifficulty]}`;
            setTimeout(() => {
                this.showTemporaryMessage(changeMessage);
            }, 2000);
        }
    }
    
    showFeedback(isCorrect) {
        const feedbackMessage = document.getElementById('feedback-message');
        const feedbackExplanation = document.getElementById('feedback-explanation');
        
        if (isCorrect) {
            feedbackMessage.textContent = '✓ 回答正确！';
            feedbackMessage.className = 'correct';
        } else {
            feedbackMessage.textContent = '✗ 回答错误';
            feedbackMessage.className = 'incorrect';
        }
        
        feedbackExplanation.textContent = this.currentQuestion.explanation;
        
        // 显示正确答案（对于多选题）
        if (this.currentQuestion.type === 'multiple_choice' && !isCorrect) {
            const correctIndex = this.currentQuestion.correct;
            const correctOption = this.currentQuestion.options[correctIndex];
            feedbackExplanation.textContent += ` 正确答案是：${correctOption}`;
        }
        
        // 标记选项的正确/错误状态
        if (this.currentQuestion.type === 'multiple_choice') {
            document.querySelectorAll('.option-btn').forEach((btn, index) => {
                btn.disabled = true;
                if (index === this.currentQuestion.correct) {
                    btn.classList.add('correct');
                } else if (btn.classList.contains('selected') && index !== this.currentQuestion.correct) {
                    btn.classList.add('incorrect');
                }
            });
        }
    }
    
    clearFeedback() {
        document.getElementById('feedback-message').textContent = '';
        document.getElementById('feedback-explanation').textContent = '';
    }
    
    showNextButton() {
        document.getElementById('next-question').style.display = 'inline-block';
    }
    
    hideNextButton() {
        document.getElementById('next-question').style.display = 'none';
    }
    
    showHint() {
        // 可以根据题目类型提供不同的提示
        let hintText = '思考一下相关物理定律和公式...';
        
        if (this.currentQuestion.category === 'kinematics') {
            hintText = '尝试使用运动学公式：v = v₀ + at, s = v₀t + ½at², v² = v₀² + 2as';
        } else if (this.currentQuestion.category === 'dynamics') {
            hintText = '记住牛顿第二定律：F = ma，别忘了考虑所有受力';
        } else if (this.currentQuestion.category === 'energy') {
            hintText = '考虑能量守恒定律：机械能守恒或功能关系';
        }
        
        this.showTemporaryMessage(hintText);
    }
    
    skipQuestion() {
        this.streak = 0;
        this.displayNewQuestion();
        this.showTemporaryMessage('已跳过当前题目');
    }
    
    showTemporaryMessage(message) {
        const feedbackMessage = document.getElementById('feedback-message');
        const originalText = feedbackMessage.textContent;
        const originalClass = feedbackMessage.className;
        
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'hint';
        
        setTimeout(() => {
            feedbackMessage.textContent = originalText;
            feedbackMessage.className = originalClass;
        }, 3000);
    }
    
    newSession() {
        if (confirm('确定要开始新的练习吗？当前进度将被保存。')) {
            this.saveUserProgress();
            this.currentDifficulty = 'easy';
            this.streak = 0;
            this.displayNewQuestion();
            this.updateStats();
            this.showTemporaryMessage('新练习已开始！');
        }
    }
    
    updateStats() {
        document.getElementById('current-difficulty').textContent = this.difficultyNames[this.currentDifficulty];
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        
        const accuracy = this.totalQuestions > 0 ? 
            Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
    }
    
    adjustDifficultyLevel(increase) {
        const levels = ['easy', 'medium', 'hard'];
        const currentIndex = levels.indexOf(this.currentDifficulty);
        
        if (increase && currentIndex < levels.length - 1) {
            this.currentDifficulty = levels[currentIndex + 1];
        } else if (!increase && currentIndex > 0) {
            this.currentDifficulty = levels[currentIndex - 1];
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsTutor();
});