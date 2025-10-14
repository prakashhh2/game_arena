// Game State Management
let currentGame = null;

// RPS Game State
let rpsScores = { player: 0, computer: 0, draw: 0 };

// Guess Game State
let targetNumber = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;
let guessBestScore = null;

// Memory Game State
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;

// Tic Tac Toe State
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttScores = { player: 0, computer: 0, draw: 0 };
let tttGameActive = true;

// Dice Game State
let diceScores = { player: 0, computer: 0, tie: 0 };

function showGame(game) {
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById(game + 'Game').classList.add('active');
    currentGame = game;

    if (game === 'memory') initMemory();
    if (game === 'tictactoe') initTTT();
}

function backToMenu() {
    document.querySelectorAll('.game-container').forEach(g => g.classList.remove('active'));
    document.getElementById('gameMenu').style.display = 'grid';
    currentGame = null;
}

// ==================== ROCK PAPER SCISSORS ====================
function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    let result = '';

    if (playerChoice === computerChoice) {
        result = `${emojis[computerChoice]} Draw! ${emojis[computerChoice]}`;
        rpsScores.draw++;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = `${emojis[playerChoice]} You Win! ${emojis[computerChoice]}`;
        rpsScores.player++;
    } else {
        result = `${emojis[computerChoice]} Computer Wins! ${emojis[playerChoice]}`;
        rpsScores.computer++;
    }

    document.getElementById('rpsResult').textContent = result;
    updateRPSScores();
}

function updateRPSScores() {
    document.getElementById('rpsPlayerScore').textContent = rpsScores.player;
    document.getElementById('rpsComputerScore').textContent = rpsScores.computer;
    document.getElementById('rpsDrawScore').textContent = rpsScores.draw;
}

// ==================== GUESS THE NUMBER ====================
function makeGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    if (!guess || guess < 1 || guess > 100) {
        document.getElementById('guessHint').textContent = 'Please enter a number between 1 and 100!';
        return;
    }

    guessAttempts++;
    document.getElementById('guessAttempts').textContent = guessAttempts;

    if (guess === targetNumber) {
        document.getElementById('guessHint').textContent = `🎉 Correct! You won in ${guessAttempts} attempts!`;
        document.getElementById('guessHint').style.color = '#4CAF50';
        
        if (!guessBestScore || guessAttempts < guessBestScore) {
            guessBestScore = guessAttempts;
            document.getElementById('guessBest').textContent = guessBestScore;
        }
    } else if (guess < targetNumber) {
        document.getElementById('guessHint').textContent = '📈 Too low! Try higher!';
        document.getElementById('guessHint').style.color = '#f5576c';
    } else {
        document.getElementById('guessHint').textContent = '📉 Too high! Try lower!';
        document.getElementById('guessHint').style.color = '#f5576c';
    }

    document.getElementById('guessInput').value = '';
}

function restartGuess() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    document.getElementById('guessAttempts').textContent = '0';
    document.getElementById('guessHint').textContent = 'Make your first guess!';
    document.getElementById('guessHint').style.color = '#667eea';
    document.getElementById('guessInput').value = '';
}

// Allow Enter key for guess game
document.addEventListener('DOMContentLoaded', function() {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                makeGuess();
            }
        });
    }
});

// ==================== MEMORY MATCH ====================
function initMemory() {
    const symbols = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎸', '⚽'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    memoryMoves = 0;
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    memoryCards.forEach((symbol, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = i;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });

    updateMemoryScores();
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        memoryMoves++;
        updateMemoryScores();
        
        setTimeout(() => {
            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                flippedCards.forEach(c => c.classList.add('matched'));
                matchedPairs++;
                updateMemoryScores();
                
                if (matchedPairs === 8) {
                    setTimeout(() => alert(`🎉 You won in ${memoryMoves} moves!`), 300);
                }
            } else {
                flippedCards.forEach(c => {
                    c.classList.remove('flipped');
                    c.textContent = '?';
                });
            }
            flippedCards = [];
        }, 800);
    }
}

function updateMemoryScores() {
    document.getElementById('memoryMoves').textContent = memoryMoves;
    document.getElementById('memoryMatches').textContent = matchedPairs;
}

function restartMemory() {
    initMemory();
}

// ==================== TIC TAC TOE ====================
function initTTT() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttGameActive = true;
    
    const grid = document.getElementById('tttGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.onclick = () => makeTTTMove(i);
        grid.appendChild(cell);
    }

    document.getElementById('tttResult').textContent = '';
    updateTTTScores();
}

function makeTTTMove(index) {
    if (!tttGameActive || tttBoard[index] !== '') return;

    tttBoard[index] = 'X';
    updateTTTBoard();

    if (checkTTTWinner()) return;

    setTimeout(() => {
        computerTTTMove();
    }, 500);
}

function computerTTTMove() {
    const available = tttBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (available.length === 0 || !tttGameActive) return;

    const move = available[Math.floor(Math.random() * available.length)];
    tttBoard[move] = 'O';
    updateTTTBoard();
    checkTTTWinner();
}

function updateTTTBoard() {
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach((cell, i) => {
        cell.textContent = tttBoard[i];
        cell.disabled = tttBoard[i] !== '';
    });
}

function checkTTTWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            tttGameActive = false;
            const winner = tttBoard[a] === 'X' ? 'You' : 'Computer';
            document.getElementById('tttResult').textContent = `${winner} Win! 🎉`;
            
            if (tttBoard[a] === 'X') {
                tttScores.player++;
            } else {
                tttScores.computer++;
            }
            updateTTTScores();
            return true;
        }
    }

    if (!tttBoard.includes('')) {
        tttGameActive = false;
        document.getElementById('tttResult').textContent = 'Draw! 🤝';
        tttScores.draw++;
        updateTTTScores();
        return true;
    }

    return false;
}

function updateTTTScores() {
    document.getElementById('tttPlayerScore').textContent = tttScores.player;
    document.getElementById('tttComputerScore').textContent = tttScores.computer;
    document.getElementById('tttDrawScore').textContent = tttScores.draw;
}

function restartTTT() {
    initTTT();
}

// ==================== DICE BATTLE ====================
function rollDice() {
    const diceValues = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const computerRoll = Math.floor(Math.random() * 6) + 1;

    document.getElementById('playerDice').textContent = diceValues[playerRoll - 1];
    document.getElementById('computerDice').textContent = diceValues[computerRoll - 1];

    let result = '';
    if (playerRoll > computerRoll) {
        result = `🎉 You Win! (${playerRoll} vs ${computerRoll})`;
        diceScores.player++;
    } else if (computerRoll > playerRoll) {
        result = `💻 Computer Wins! (${computerRoll} vs ${playerRoll})`;
        diceScores.computer++;
    } else {
        result = `🤝 It's a Tie! (${playerRoll} vs ${computerRoll})`;
        diceScores.tie++;
    }

    document.getElementById('diceResult').textContent = result;
    updateDiceScores();
}

function updateDiceScores() {
    document.getElementById('dicePlayerScore').textContent = diceScores.player;
    document.getElementById('diceComputerScore').textContent = diceScores.computer;
    document.getElementById('diceTieScore').textContent = diceScores.tie;
}