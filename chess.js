// 智能国际象棋游戏
class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.enPassantTarget = null;
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
        this.gameStatus = 'playing';
        this.aiDifficulty = 'easy';
        this.moveCount = 0;
        this.startTime = Date.now();
        this.timer = null;
        
        this.initializeBoard();
        this.renderBoard();
        this.bindEvents();
        this.startTimer();
    }

    // 初始化棋盘
    initializeBoard() {
        // Unicode 棋子符号
        const pieces = {
            white: {
                king: '♔', queen: '♕', rook: '♖',
                bishop: '♗', knight: '♘', pawn: '♙'
            },
            black: {
                king: '♚', queen: '♛', rook: '♜',
                bishop: '♝', knight: '♞', pawn: '♟'
            }
        };

        // 初始棋盘布局
        this.board = [
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];
    }

    // 渲染棋盘
    renderBoard() {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = piece;
                    pieceElement.draggable = true;
                    square.appendChild(pieceElement);
                }

                square.addEventListener('click', (e) => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }

    // 处理方格点击
    handleSquareClick(row, col) {
        if (this.gameStatus !== 'playing' || this.currentPlayer === 'black') {
            return;
        }

        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            // 尝试移动
            if (this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
                this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                this.selectedSquare = null;
                this.clearHighlights();
                
                // AI 回合
                if (this.gameStatus === 'playing') {
                    setTimeout(() => this.makeAIMove(), 500);
                }
            } else if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                // 选择新棋子
                this.selectSquare(row, col);
            } else {
                // 取消选择
                this.selectedSquare = null;
                this.clearHighlights();
            }
        } else if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
            // 选择棋子
            this.selectSquare(row, col);
        }
    }

    // 选择方格
    selectSquare(row, col) {
        this.clearHighlights();
        this.selectedSquare = { row, col };
        
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');
        
        // 显示可能的移动
        this.showPossibleMoves(row, col);
    }

    // 显示可能的移动
    showPossibleMoves(row, col) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(row, col, r, c)) {
                    const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (this.board[r][c]) {
                        square.classList.add('possible-capture');
                    } else {
                        square.classList.add('possible-move');
                    }
                }
            }
        }
    }

    // 清除高亮
    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'possible-move', 'possible-capture', 'check');
        });
    }

    // 检查棋子是否属于当前玩家
    isPieceOwnedByCurrentPlayer(piece) {
        const whitePieces = '♔♕♖♗♘♙';
        const blackPieces = '♚♛♜♝♞♟';
        
        if (this.currentPlayer === 'white') {
            return whitePieces.includes(piece);
        } else {
            return blackPieces.includes(piece);
        }
    }

    // 验证移动合法性
    isValidMove(fromRow, fromCol, toRow, toCol) {
        // 基本检查
        if (fromRow === toRow && fromCol === toCol) return false;
        if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
        
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        
        if (!piece) return false;
        if (targetPiece && this.isPieceOwnedByCurrentPlayer(targetPiece)) return false;
        
        // 根据棋子类型检查移动规则
        const pieceType = this.getPieceType(piece);
        return this.isPieceMoveValid(pieceType, fromRow, fromCol, toRow, toCol);
    }

    // 获取棋子类型
    getPieceType(piece) {
        const pieceMap = {
            '♔': 'king', '♚': 'king',
            '♕': 'queen', '♛': 'queen',
            '♖': 'rook', '♜': 'rook',
            '♗': 'bishop', '♝': 'bishop',
            '♘': 'knight', '♞': 'knight',
            '♙': 'pawn', '♟': 'pawn'
        };
        return pieceMap[piece];
    }

    // 检查棋子移动规则
    isPieceMoveValid(pieceType, fromRow, fromCol, toRow, toCol) {
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        switch (pieceType) {
            case 'pawn':
                return this.isPawnMoveValid(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
            case 'rook':
                return this.isRookMoveValid(fromRow, fromCol, toRow, toCol);
            case 'knight':
                return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
            case 'bishop':
                return absRowDiff === absColDiff && this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'queen':
                return this.isRookMoveValid(fromRow, fromCol, toRow, toCol) || 
                       (absRowDiff === absColDiff && this.isPathClear(fromRow, fromCol, toRow, toCol));
            case 'king':
                return absRowDiff <= 1 && absColDiff <= 1;
            default:
                return false;
        }
    }

    // 兵的移动规则
    isPawnMoveValid(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
        const piece = this.board[fromRow][fromCol];
        const isWhite = '♔♕♖♗♘♙'.includes(piece);
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        
        // 前进
        if (colDiff === 0) {
            if (rowDiff === direction && !this.board[toRow][toCol]) {
                return true;
            }
            if (fromRow === startRow && rowDiff === 2 * direction && 
                !this.board[toRow][toCol] && !this.board[fromRow + direction][fromCol]) {
                return true;
            }
        }
        
        // 斜向吃子
        if (Math.abs(colDiff) === 1 && rowDiff === direction) {
            if (this.board[toRow][toCol]) {
                return true;
            }
            // 吃过路兵
            if (this.enPassantTarget && this.enPassantTarget.row === toRow && 
                this.enPassantTarget.col === toCol) {
                return true;
            }
        }
        
        return false;
    }

    // 车的移动规则
    isRookMoveValid(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }

    // 检查路径是否清晰
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }

    // 执行移动
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // 记录移动
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: capturedPiece,
            player: this.currentPlayer,
            notation: this.getMoveNotation(fromRow, fromCol, toRow, toCol)
        });
        
        // 处理吃子
        if (capturedPiece) {
            const capturedColor = '♔♕♖♗♘♙'.includes(capturedPiece) ? 'white' : 'black';
            this.capturedPieces[capturedColor].push(capturedPiece);
        }
        
        // 移动棋子
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // 处理特殊移动
        this.handleSpecialMoves(fromRow, fromCol, toRow, toCol);
        
        // 检查升变
        if (this.getPieceType(piece) === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.showPromotionDialog(toRow, toCol);
        }
        
        // 更新游戏状态
        this.updateGameState();
        
        // 重新渲染
        this.renderBoard();
        this.updateUI();
    }

    // 处理特殊移动
    handleSpecialMoves(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[toRow][toCol];
        const pieceType = this.getPieceType(piece);
        
        // 过路兵
        if (pieceType === 'pawn' && Math.abs(toCol - fromCol) === 1 && !this.board[toRow][toCol]) {
            const captureRow = this.currentPlayer === 'white' ? toRow + 1 : toRow - 1;
            const capturedPawn = this.board[captureRow][toCol];
            this.board[captureRow][toCol] = null;
        }
        
        // 更新过路兵目标
        if (pieceType === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            this.enPassantTarget = {
                row: (fromRow + toRow) / 2,
                col: fromCol
            };
        } else {
            this.enPassantTarget = null;
        }
        
        // 王车易位
        if (pieceType === 'king' && Math.abs(toCol - fromCol) === 2) {
            if (toCol === 6) { // 短易位
                this.board[toRow][5] = this.board[toRow][7];
                this.board[toRow][7] = null;
            } else if (toCol === 2) { // 长易位
                this.board[toRow][3] = this.board[toRow][0];
                this.board[toRow][0] = null;
            }
        }
        
        // 更新易位权利
        this.updateCastlingRights(piece, fromRow, fromCol);
    }

    // 更新易位权利
    updateCastlingRights(piece, fromRow, fromCol) {
        const pieceType = this.getPieceType(piece);
        const color = this.currentPlayer;
        
        if (pieceType === 'king') {
            this.castlingRights[color].kingside = false;
            this.castlingRights[color].queenside = false;
        }
        
        if (pieceType === 'rook') {
            if (fromCol === 0) {
                this.castlingRights[color].queenside = false;
            } else if (fromCol === 7) {
                this.castlingRights[color].kingside = false;
            }
        }
    }

    // 显示升变对话框
    showPromotionDialog(row, col) {
        const modal = document.getElementById('promotion-modal');
        const piecesContainer = document.getElementById('promotion-pieces');
        const isWhite = this.currentPlayer === 'white';
        
        const pieces = [
            isWhite ? '♕' : '♛',
            isWhite ? '♖' : '♜',
            isWhite ? '♗' : '♝',
            isWhite ? '♘' : '♞'
        ];
        
        piecesContainer.innerHTML = '';
        pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'promotion-piece';
            pieceElement.textContent = piece;
            pieceElement.onclick = () => {
                this.board[row][col] = piece;
                modal.classList.remove('show');
                this.renderBoard();
                this.checkGameStatus();
            };
            piecesContainer.appendChild(pieceElement);
        });
        
        modal.classList.add('show');
    }

    // 获取移动记录符号
    getMoveNotation(fromRow, fromCol, toRow, toCol) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        const piece = this.board[fromRow][fromCol];
        const pieceType = this.getPieceType(piece);
        const captured = this.board[toRow][toCol];
        
        let notation = '';
        
        // 棋子符号
        if (pieceType !== 'pawn') {
            notation += pieceType.charAt(0).toUpperCase();
        }
        
        // 起始位置
        notation += files[fromCol] + ranks[fromRow];
        
        // 吃子符号
        if (captured) {
            notation += 'x';
        }
        
        // 目标位置
        notation += files[toCol] + ranks[toRow];
        
        return notation;
    }

    // 检查游戏状态
    checkGameStatus() {
        if (this.isInCheck(this.currentPlayer)) {
            if (this.isCheckmate(this.currentPlayer)) {
                this.gameStatus = 'checkmate';
                this.showGameEndMessage(`${this.currentPlayer === 'white' ? '黑方' : '白方'}获胜！`);
            } else {
                this.showCheck();
                this.showToast(`${this.currentPlayer === 'white' ? '白方' : '黑方'}被将军！`);
            }
        } else if (this.isStalemate(this.currentPlayer)) {
            this.gameStatus = 'stalemate';
            this.showGameEndMessage('和棋 - 无子可动');
        } else if (this.isInsufficientMaterial()) {
            this.gameStatus = 'stalemate';
            this.showGameEndMessage('和棋 - 子力不足');
        } else if (this.isThreefoldRepetition()) {
            this.gameStatus = 'stalemate';
            this.showGameEndMessage('和棋 - 三次重复');
        }
    }

    // 检查是否被将军
    isInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && !this.isPieceOwnedByCurrentPlayer(piece)) {
                    if (this.isValidMove(row, col, kingPos.row, kingPos.col)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    // 查找国王位置
    findKing(color) {
        const kingSymbol = color === 'white' ? '♔' : '♚';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingSymbol) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    // 检查是否将死
    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        
        return !this.hasAnyLegalMove(color);
    }

    // 检查是否无子可动
    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        
        return !this.hasAnyLegalMove(color);
    }

    // 检查是否有任何合法移动
    hasAnyLegalMove(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.wouldBeLegalMove(fromRow, fromCol, toRow, toCol, color)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    // 检查移动是否合法（考虑将军状态）
    wouldBeLegalMove(fromRow, fromCol, toRow, toCol, color) {
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;
        
        // 临时执行移动
        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;
        
        const inCheck = this.isInCheck(color);
        
        // 恢复棋盘
        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;
        
        return !inCheck;
    }

    // 检查子力不足
    isInsufficientMaterial() {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col]) {
                    pieces.push(this.board[row][col]);
                }
            }
        }
        
        // 只有国王
        if (pieces.length === 2) return true;
        
        // 国王和象/马
        if (pieces.length === 3) {
            const hasBishopOrKnight = pieces.some(p => 
                this.getPieceType(p) === 'bishop' || this.getPieceType(p) === 'knight'
            );
            return hasBishopOrKnight;
        }
        
        return false;
    }

    // 检查三次重复
    isThreefoldRepetition() {
        if (this.moveHistory.length < 6) return false;
        
        const currentBoard = this.getBoardString();
        let repetitions = 0;
        
        for (let move of this.moveHistory) {
            if (move.boardState === currentBoard) {
                repetitions++;
                if (repetitions >= 2) return true;
            }
        }
        
        return false;
    }

    // 获取棋盘状态字符串
    getBoardString() {
        return this.board.flat().map(p => p || ' ').join('');
    }

    // 显示将军
    showCheck() {
        const kingPos = this.findKing(this.currentPlayer);
        if (kingPos) {
            const square = document.querySelector(`[data-row="${kingPos.row}"][data-col="${kingPos.col}"]`);
            square.classList.add('check');
        }
    }

    // 更新游戏状态
    updateGameState() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.moveCount++;
        
        if (this.currentPlayer === 'white') {
            this.fullMoveNumber++;
        }
        
        // 更新半步计数器
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        if (lastMove && (lastMove.captured || this.getPieceType(lastMove.piece) === 'pawn')) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }
        
        this.checkGameStatus();
    }

    // AI 移动
    async makeAIMove() {
        if (this.gameStatus !== 'playing' || this.currentPlayer !== 'black') return;
        
        this.showToast('AI 思考中...');
        
        const move = await this.getBestMove();
        if (move) {
            setTimeout(() => {
                this.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
            }, 1000);
        }
    }

    // 获取最佳移动
    async getBestMove() {
        const moves = this.getAllPossibleMoves('black');
        if (moves.length === 0) return null;
        
        switch (this.aiDifficulty) {
            case 'easy':
                return this.getRandomMove(moves);
            case 'medium':
                return this.getMediumMove(moves);
            case 'hard':
                return await this.getHardMove(moves);
            case 'expert':
                return await this.getExpertMove(moves);
            default:
                return this.getRandomMove(moves);
        }
    }

    // 获取随机移动
    getRandomMove(moves) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // 获取中等难度移动
    getMediumMove(moves) {
        // 优先吃子
        const captureMoves = moves.filter(move => this.board[move.to.row][move.to.col]);
        if (captureMoves.length > 0) {
            return this.getRandomMove(captureMoves);
        }
        
        // 优先中心控制
        const centerMoves = moves.filter(move => 
            (move.to.row >= 3 && move.to.row <= 4) && (move.to.col >= 3 && move.to.col <= 4)
        );
        if (centerMoves.length > 0) {
            return this.getRandomMove(centerMoves);
        }
        
        return this.getRandomMove(moves);
    }

    // 获取困难难度移动
    async getHardMove(moves) {
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const score = this.evaluateMove(move, 2);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    // 获取专家难度移动
    async getExpertMove(moves) {
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const score = this.evaluateMove(move, 3);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    // 评估移动
    evaluateMove(move, depth) {
        // 临时执行移动
        const originalPiece = this.board[move.to.row][move.to.col];
        const movingPiece = this.board[move.from.row][move.from.col];
        this.board[move.to.row][move.to.col] = movingPiece;
        this.board[move.from.row][move.from.col] = null;
        
        let score = this.evaluatePosition() + this.getRandomNoise();
        
        // Minimax 搜索
        score += this.minimax(depth, false, -Infinity, Infinity);
        
        // 恢复棋盘
        this.board[move.from.row][move.from.col] = movingPiece;
        this.board[move.to.row][move.to.col] = originalPiece;
        
        return score;
    }

    // Minimax 算法
    minimax(depth, isMaximizing, alpha, beta) {
        if (depth === 0) {
            return this.evaluatePosition();
        }
        
        const color = isMaximizing ? 'black' : 'white';
        const moves = this.getAllPossibleMoves(color);
        
        if (moves.length === 0) {
            if (this.isInCheck(color)) {
                return isMaximizing ? -10000 : 10000;
            }
            return 0; // 和棋
        }
        
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const eval_ = this.makeMoveAndEvaluate(move, depth - 1, false, alpha, beta);
                maxEval = Math.max(maxEval, eval_);
                alpha = Math.max(alpha, eval_);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const eval_ = this.makeMoveAndEvaluate(move, depth - 1, true, alpha, beta);
                minEval = Math.min(minEval, eval_);
                beta = Math.min(beta, eval_);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    // 执行移动并评估
    makeMoveAndEvaluate(move, depth, isMaximizing, alpha, beta) {
        const originalPiece = this.board[move.to.row][move.to.col];
        const movingPiece = this.board[move.from.row][move.from.col];
        
        this.board[move.to.row][move.to.col] = movingPiece;
        this.board[move.from.row][move.from.col] = null;
        
        const eval_ = this.minimax(depth, isMaximizing, alpha, beta);
        
        this.board[move.from.row][move.from.col] = movingPiece;
        this.board[move.to.row][move.to.col] = originalPiece;
        
        return eval_;
    }

    // 评估位置
    evaluatePosition() {
        let score = 0;
        
        // 棋子价值表
        const pieceValues = {
            'pawn': 100, 'knight': 320, 'bishop': 330,
            'rook': 500, 'queen': 900, 'king': 20000
        };
        
        // 位置价值表
        const pawnTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (!piece) continue;
                
                const pieceType = this.getPieceType(piece);
                const isWhite = '♔♕♖♗♘♙'.includes(piece);
                const multiplier = isWhite ? -1 : 1;
                
                // 基础价值
                score += pieceValues[pieceType] * multiplier;
                
                // 位置价值
                if (pieceType === 'pawn') {
                    const tableRow = isWhite ? 7 - row : row;
                    score += pawnTable[tableRow][col] * multiplier;
                }
            }
        }
        
        return score;
    }

    // 添加随机噪声
    getRandomNoise() {
        return (Math.random() - 0.5) * 10;
    }

    // 获取所有可能移动
    getAllPossibleMoves(color) {
        const moves = [];
        
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.wouldBeLegalMove(fromRow, fromCol, toRow, toCol, color)) {
                                moves.push({
                                    from: { row: fromRow, col: fromCol },
                                    to: { row: toRow, col: toCol }
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }

    // 更新UI
    updateUI() {
        // 更新当前玩家
        document.getElementById('current-player-text').textContent = 
            this.currentPlayer === 'white' ? '白方' : '黑方';
        document.getElementById('current-player-indicator').className = 
            `player-indicator ${this.currentPlayer}`;
        
        // 更新统计
        document.getElementById('move-count').textContent = this.moveCount;
        document.getElementById('captured-count').textContent = 
            this.capturedPieces.black.length + this.capturedPieces.white.length;
        
        // 更新评估
        const evaluation = this.evaluatePosition() / 100;
        document.getElementById('evaluation').textContent = evaluation.toFixed(1);
        
        // 更新移动历史
        const historyElement = document.getElementById('move-history');
        historyElement.innerHTML = '';
        this.moveHistory.forEach((move, index) => {
            if (index % 2 === 0) {
                const moveDiv = document.createElement('div');
                moveDiv.className = 'move-item';
                moveDiv.innerHTML = `
                    <span class="move-number">${Math.floor(index / 2) + 1}.</span>
                    ${move.notation}
                `;
                historyElement.appendChild(moveDiv);
            } else {
                const lastMove = historyElement.lastElementChild;
                if (lastMove) {
                    lastMove.innerHTML += ` ${move.notation}`;
                }
            }
        });
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    // 开始计时器
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('time-elapsed').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // 新游戏
    newGame() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.enPassantTarget = null;
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
        this.gameStatus = 'playing';
        this.moveCount = 0;
        this.startTime = Date.now();
        
        clearInterval(this.timer);
        this.startTimer();
        
        this.initializeBoard();
        this.renderBoard();
        this.updateUI();
        this.showToast('新游戏开始！');
    }

    // 悔棋
    undo() {
        if (this.moveHistory.length < 2) {
            this.showToast('无法悔棋');
            return;
        }
        
        // 撤销两步（玩家和AI）
        for (let i = 0; i < 2; i++) {
            this.undoMove();
        }
        
        this.renderBoard();
        this.updateUI();
        this.showToast('悔棋成功');
    }

    // 撤销移动
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
        
        this.currentPlayer = lastMove.player;
        this.moveCount--;
    }

    // 提示
    hint() {
        if (this.currentPlayer === 'black') {
            this.showToast('现在是 AI 的回合');
            return;
        }
        
        const moves = this.getAllPossibleMoves('white');
        if (moves.length === 0) {
            this.showToast('没有可用的移动');
            return;
        }
        
        // 找一个好的移动
        let bestMove = moves[0];
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const score = this.evaluateMove(move, 1);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        // 高亮提示
        this.clearHighlights();
        const fromSquare = document.querySelector(
            `[data-row="${bestMove.from.row}"][data-col="${bestMove.from.col}"]`
        );
        const toSquare = document.querySelector(
            `[data-row="${bestMove.to.row}"][data-col="${bestMove.to.col}"]`
        );
        
        fromSquare.classList.add('selected');
        toSquare.classList.add('possible-move');
        
        this.showToast('建议移动已高亮显示');
    }

    // 认输
    resign() {
        if (confirm(`确定要认输吗？${this.currentPlayer === 'white' ? '黑方' : '白方'}将获胜。`)) {
            this.gameStatus = 'resign';
            this.showGameEndMessage(`${this.currentPlayer === 'white' ? '黑方' : '白方'}获胜！`);
        }
    }

    // 显示游戏结束消息
    showGameEndMessage(message) {
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = message;
        statusElement.className = this.gameStatus === 'checkmate' ? 
            'game-status checkmate' : 'game-status stalemate';
    }

    // 显示提示信息
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 绑定事件
    bindEvents() {
        // 新游戏按钮
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // 悔棋按钮
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });
        
        // 提示按钮
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.hint();
        });
        
        // 认输按钮
        document.getElementById('resign-btn').addEventListener('click', () => {
            this.resign();
        });
        
        // AI 难度选择
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.aiDifficulty = e.target.dataset.level;
                this.showToast(`AI 难度设置为 ${e.target.textContent}`);
            });
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'n':
                case 'N':
                    this.newGame();
                    break;
                case 'u':
                case 'U':
                    this.undo();
                    break;
                case 'h':
                case 'H':
                    this.hint();
                    break;
                case 'r':
                case 'R':
                    this.resign();
                    break;
            }
        });
    }
}

// 初始化游戏
let chessGame;
document.addEventListener('DOMContentLoaded', () => {
    chessGame = new ChessGame();
});