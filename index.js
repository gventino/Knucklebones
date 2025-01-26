"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8080 });
console.log('Server running on 8080');
let players = [];
let gameStarted = false;
let currentTurn = 0;
let player1Matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
let player2Matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
// roll the dice
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}
function filterDuplicates(array) {
    // count how many times each number appears
    const frequency = {};
    array.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    // filter numbers that appear more than once
    return array.filter(num => frequency[num] > 1);
}
function calculateScore(matrix) {
    let score = 0;
    // check each column
    for (let col = 0; col < 3; col++) {
        let diceInColumn = [];
        // get dice in column
        for (let row = 0; row < 3; row++) {
            if (matrix[row][col] !== 0) {
                diceInColumn.push(matrix[row][col]);
            }
        }
        // find duplicates
        let duplicates = filterDuplicates(diceInColumn);
        // calculate score based on duplicates
        let duplicateCount = duplicates.length;
        duplicates.map(val => score += val * duplicateCount);
        // remove unique values from duplicates
        diceInColumn = diceInColumn.filter(item => !duplicates.includes(item));
        // add unique values to score
        score += diceInColumn.reduce((acc, current) => acc + current, 0);
    }
    return score;
}
// update the matrix and remove matching dice from opponent's column
function updateMatrix(player, column, dice) {
    const matrix = player === 0 ? player1Matrix : player2Matrix;
    const opponentMatrix = player === 0 ? player2Matrix : player1Matrix;
    // check if the opponent has the same dice in the column
    for (let i = 2; i >= 0; i--) {
        if (opponentMatrix[i][column] === dice) {
            // remove the matching dice from opponent's column
            opponentMatrix[i][column] = 0;
        }
    }
    // put the dice in the player's matrix
    for (let i = 2; i >= 0; i--) {
        if (matrix[i][column] === 0) {
            matrix[i][column] = dice;
            return true;
        }
    }
    return false;
}
// check if any player has filled their matrix
function checkGameEnd() {
    // check if matrix is completely filled
    const isMatrixFilled = (matrix) => {
        return matrix.every(row => row.every(cell => cell !== 0));
    };
    return isMatrixFilled(player1Matrix) || isMatrixFilled(player2Matrix);
}
wss.on('connection', (ws) => {
    console.log('Player connected');
    players.push(ws);
    if (players.length === 1) {
        // for the first player, send isPlayer1 = true
        ws.send(JSON.stringify({ message: 'Player 1', isPlayer1: true }));
    }
    else if (players.length === 2) {
        // for the second player, send isPlayer1 = false
        players[0].send(JSON.stringify({ message: 'Player 1', isPlayer1: true }));
        ws.send(JSON.stringify({ message: 'Player 2', isPlayer1: false }));
        gameStarted = true;
        console.log('Game started');
        players.forEach((player) => {
            player.send(JSON.stringify({ message: 'Game started' }));
        });
        // start the first turn
        const currentDice = rollDice();
        players[currentTurn].send(JSON.stringify({
            message: 'Your turn',
            dice: currentDice
        }));
    }
    else {
        ws.send(JSON.stringify({ message: 'Wait for another player...' }));
    }
    ws.on('message', (message) => {
        if (!gameStarted)
            return;
        const data = JSON.parse(message);
        if (data.type === 'chooseColumn') {
            const currentDice = data.dice;
            const chosenColumn = data.column;
            if (updateMatrix(currentTurn, chosenColumn, currentDice)) {
                // send updated matrices and scores to both players
                players.forEach((player) => {
                    player.send(JSON.stringify({
                        player1Matrix: player1Matrix,
                        player2Matrix: player2Matrix,
                        player1Score: calculateScore(player1Matrix),
                        player2Score: calculateScore(player2Matrix)
                    }));
                });
                // switch turns
                currentTurn = 1 - currentTurn;
                // roll dice for the next player
                const newDice = rollDice();
                players[currentTurn].send(JSON.stringify({
                    message: 'Your turn',
                    dice: newDice
                }));
                // check for end of game
                if (checkGameEnd()) {
                    if (calculateScore(player1Matrix) > calculateScore(player2Matrix) && currentTurn == 0) {
                        players[currentTurn].send(JSON.stringify({ message: 'You won!' }));
                        players[1 - currentTurn].send(JSON.stringify({ message: 'You lost!' }));
                    }
                    else {
                        players[currentTurn].send(JSON.stringify({ message: 'You lost!' }));
                        players[1 - currentTurn].send(JSON.stringify({ message: 'You won!' }));
                    }
                    gameStarted = false;
                    return;
                }
            }
        }
    });
    ws.on('close', () => {
        console.log('Player disconnected');
        players = players.filter((player) => player !== ws);
        if (players.length === 0) {
            gameStarted = false;
            currentTurn = 0;
            player1Matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            player2Matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        }
    });
});
