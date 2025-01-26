let matrix1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let matrix2 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let selected1 = 0;
let currentDice = null;
let isPlayer1 = null;
let ws = new WebSocket('ws://localhost:8080');
let score1 = 0;
let score2 = 0;

function setup() {
  createCanvas(300, 820);
  setupWebSocketHandlers();
}

function draw() {
  background(128);
  drawMatrices();
  drawSelector();
  drawCurrentDice();
  drawScores();  // draw player scores
}

function setupWebSocketHandlers() {
  ws.onmessage = (event) => {
    try {
      handleWebSocketMessage(JSON.parse(event.data));
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };
}

function handleWebSocketMessage(message) {
  console.log('Message received:', message);  // added log for debugging

  switch (message.message) {
    case 'Game started':
      console.log('Game started');
      break;

    case 'Player 1':
      isPlayer1 = true;
      break;

    case 'Player 2':
      isPlayer1 = false;
      break;

    case 'Wait for another player...':
      console.log('Wait for another player...');
      break;

    case 'Your turn':
      currentDice = message.dice;
      break;

    case 'You won!':
      alert('You won!');
      break;

    case 'You lost!':
      alert('You lost!');
      break;

    default:
      // checks for matrices and scores
      if (message.player1Matrix && message.player2Matrix) {
        updateMatrices(message.player1Matrix, message.player2Matrix);
      }
      if (message.player1Score && message.player2Score) {
        updateScores(message.player1Score, message.player2Score);
      }
      break;
  }
}

function updateMatrices(player1Matrix, player2Matrix) {
  matrix1 = player1Matrix;
  matrix2 = player2Matrix;
  drawMatrices();
}

function updateScores(player1Score, player2Score) {
  score1 = player1Score;
  score2 = player2Score;
  drawScores();
}

function drawMatrices() {
  let offsetY = 100;  // space adjustment for matrices

  // draw matrices depending on player
  if (isPlayer1) {
    drawMatrix(matrix1, 10, 10);
    drawMatrix(matrix2, 10, offsetY + 300);
  } else {
    drawMatrix(matrix2, 10, 10);
    drawMatrix(matrix1, 10, offsetY + 300);
  }
}

function drawMatrix(matrix, x, y) {
  let cellSize = 90;  // reduced cell size for better spacing
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      drawCell(matrix[i][j], x + j * cellSize, y + i * cellSize, cellSize);
    }
  }
}

function drawCell(value, x, y, cellSize) {
  fill(255);
  stroke(0);
  rect(x, y, cellSize - 10, cellSize - 10, 10); // rounded corners
  if (value !== 0) {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(value, x + cellSize / 2, y + cellSize / 2); // centered text
  }
}

function drawSelector() {
  let cellSize = 90;
  fill(255, 0, 0, 150);
  noFill();
  stroke(255);
  strokeWeight(3);
  let x = selected1 * cellSize + 50;
  let y = 320;
  triangle(x - 10, y, x + 10, y, x, y - 10); // selection indicator
}

function drawCurrentDice() {
  if (currentDice) {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(`Dice: ${currentDice}`, width / 2, 370);  // positioning text in the center
  }
}

function drawScores() {
  fill(0);
  strokeWeight(0);
  textSize(24);
  textAlign(LEFT, TOP);

  // Player 1 score
  text(`Player 1: ${score1}`, 10, height - 90);  // position score lower

  // Player 2 score
  text(`Player 2: ${score2}`, 10, height - 60);  // even lower
  strokeWeight(3);
}

function keyPressed() {
  if (currentDice) {
    handlePlayerInput();
  }
}

function handlePlayerInput() {
  if (keyCode === LEFT_ARROW) {
    selected1 = (selected1 - 1 + 3) % 3;
  } else if (keyCode === RIGHT_ARROW) {
    selected1 = (selected1 + 1) % 3;
  } else if (keyCode === ENTER) {
    sendColumnChoice();
    currentDice = null;
  }
}

function sendColumnChoice() {
  ws.send(JSON.stringify({
    type: 'chooseColumn',
    dice: currentDice,
    column: selected1
  }));
}

