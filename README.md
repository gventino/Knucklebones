# Knucklebones Game
=================

Knucklebones is a two-player dice-based game where players take turns rolling dice and filling out their matrices by selecting columns and removing matching dice from their opponent's matrix. The goal is to fill the matrix while maximizing your score based on the dice values in the columns.

Features
--------

*   **WebSocket Server**: The game uses WebSocket for real-time communication between the client and server.
*   **Game Logic**: Each player has a 3x3 matrix, and on their turn, they roll a die and choose a column to place their rolled value. Players must remove matching dice from their opponent's matrix.
*   **Game End**: The game ends when a player fills their matrix, and the player with the highest score wins.
*   **WebSocket Communication**: The server sends messages to the clients about game events (e.g., turn updates, scores, game results).
*   **Responsive UI**: The game is played in a browser with a dynamic interface built using the p5.js library.

Installation
------------

### Prerequisites

*   Node.js (v16 or later) for running the server.
*   A modern browser (e.g., Chrome, Firefox).

### Setting Up the Server

1.  Clone this repository:
    ```bash
    git clone https://github.com/gventino/Knucklebones.git
    cd Knucklebones
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Compile and run!
    ```bash
    npx tsc | node index.js
    ```
    This will start a WebSocket server on port localhost 8080.

    Feel free to put this websocket server in a cloud and change the url at the `index.html`, and put it at a http server.

### Running the Game

1. Open `index.html` in a web browser.
2. The first player to join will automatically be Player 1, and the second player will be Player 2.
3. The game will start once both players have joined.
4. Players can interact with the game by selecting columns with arrow keys and submitting their moves with the `Enter` key.
5. The game ends when one player fills their matrix, and the player with the highest score wins.

Files Overview
--------------

### `index.html`

- This file includes the HTML structure for the game.
- It loads the `p5.js` library and a custom `style.css` for styling.
- The script `client.js` handles the front-end logic and WebSocket communication.

### `index.ts`

- This is the server-side code, which is written in TypeScript.
- The server handles WebSocket connections, player management, game logic, and sends messages to the clients about game updates.
- It contains functions for rolling dice, updating player matrices, calculating scores, and handling game end conditions.

### `client.js`

- The client-side code for handling game interactions and UI.
- It uses the p5.js library to draw the game interface (matrices, dice, scores).
- The script manages the WebSocket connection, receives messages from the server, and sends player actions (e.g., column selections).
- It updates the UI based on the current game state and alerts the player when the game ends.

Game Rules
----------

1. **Players**: There are two players in the game, Player 1 and Player 2.
2. **Turn-Based**: The game is turn-based. Each player rolls a dice, and on their turn, they select a column in their matrix to place the rolled dice.
3. **Dice Matching**: If the opponent has the same dice in a column, the dice is removed from their column.
4. **Score Calculation**: After each turn, the score is calculated based on the dice values in the columns. Duplicated dice in a column will earn more points.
5. **Winning**: The game ends when one player fills their matrix, and the player with the higher score wins.

Gameplay Example
----------------

1. **Starting the Game**: Two players connect to the WebSocket server. The game starts once both players are connected.
2. **Rolling the Dice**: On each turn, the current player rolls a dice, and the rolled value is displayed on the screen.
3. **Selecting a Column**: The player selects a column (using the left/right arrow keys) and presses `Enter` to place the dice.
4. **Updating Matrices**: The matrices are updated, and the game state (scores, matrices) is sent to both players.
5. **Game End**: The game ends when a player has filled their matrix. The final scores are compared, and the winner is announced.

Contributing
------------

Feel free to fork this repository, make improvements, or report any issues you encounter.
