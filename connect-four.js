
/**
 * Creates an instance of Game. This handles the buttons on screen and handling turns outside of the AI and board objects, but still hosts them. 
 * 
 * @constructor
 * @this {Game}
 */
function Game() {

    this.status = 0; // 0: running, 1: won, 2: lost, 3: tie
    this.depth = 4; // Search depth
    this.score = 100000, // Win/loss score. 100000 = AI has won, -100000 = Player has won. 
    this.winning_array = []; // Winning (chips) array
    this.iterations = 0; // Iteration count

    this.round = 0; // 0: First human player, 1: Computer, 2: Second human player
    this.mode = 1; // 1: Human vs AI, 2: Human vs Human
    this.color = 1; // 0: Black = player 1, red = player 2 / AI; 1: vice versa.
    this.first = true; // true if player 1 is going first, false if the AI/Player 2 is going first

    that = this;
}

/**
 * Start a new game function
 */
// Set variables based on the start menu. 

Game.prototype.generateGame = function () {
    // Clear the turn indicator
    document.getElementById("current-turn-indicator").className = '';
    // Update preferences based on main manu
    if (document.getElementById('first').checked) {
        this.first = true;
    } else {
        this.first = false;
    }
    if (document.getElementById('red').checked) {
        this.color = 0;
    } else {
        this.color = 1;
    }
    // Reset the round based on the above settings
    if (that.first) {
        this.round = 0;
    } else {
        if(this.mode == 1){
            this.round = 1
        } else{
          this.round = 2;
        }
    }
    // Create a new board object
    this.board = new Board(this, [], this.round);
    // Fill in the board object's field with an empty 2D array
    this.board.createBoard();
    // Create the visual board the user can interact with to influence the board object
    this.createVisualBoard();

    // Only if the game is Human vs AI will we load in an AI object
    if (that.mode == 1) {
        this.AI = new AI(this);
    } else {
        // Only in single player do we need the turn indicator
        this.updateTurnIndicator();
    }
    // This will check if it's a single player game and if the AI will be going first, and if so make a move
    this.checkForComputerFirstMove();
    // Reset all the previous stuff that may've been from a previous round if the user changed the preferences and made a new game. 
    this.resetStatus();
    this.resetVisuals();
}

Game.prototype.checkForComputerFirstMove = function () {
    // If the player is going second and it's a single player game, then the AI makes its opening move. 
    if (!that.first && that.mode == 1) {
        that.round = 1; 
        that.generateComputerDecision();
    }
}

// Reset the visual status to running
Game.prototype.resetStatus = function () {
    that.status = 0;
    var html = document.getElementById('status');
    html.className = "status-running";
    html.innerHTML = "running";
}

// Clear the visual board and everything on it - except for the turn indicator. 
Game.prototype.resetVisuals = function () {
    document.getElementById('winner-indicator').innerHTML = "";
    document.getElementById('ai-iterations').innerHTML = "?";
    document.getElementById('ai-time').innerHTML = "?";
    document.getElementById('ai-column').innerHTML = "?";
    document.getElementById('ai-score').innerHTML = "?";
    document.getElementById('game_board').className = "";
}

// Create the visual game board for the player to interact with
Game.prototype.createVisualBoard = function () {
    var game_board = "";
    for (var i = 0; i < this.board.rows; i++) {
        game_board += "<tr>";
        for (var j = 0; j < this.board.columns; j++) {
            game_board += "<td class='empty'></td>";
        }
        game_board += "</tr>";
    }
    // Add the board to the DOM
    document.getElementById('game_board').innerHTML = game_board;

    // Action listener var
    var td = document.getElementById('game_board').getElementsByTagName("td");

    // Add the 'act' function to each space in the table 
    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
}

// Toggle the main menu
function toggleMenu() {
    $("#main-menu").toggleClass("hide");
    $("#container").toggleClass("hide");
    hideOptions();
    // Determines if we show the difficulty and debug menus
    if (this.Game.mode == 1) {
        $("#aiDiffButton").removeClass("hide");
        $("#debug").removeClass("hide");
    } else {
        $("#aiDiffButton").addClass("hide");
        $("#debug").addClass("hide");
    }
}

// Toggle AI Difficulty menu
function toggleOption() {
    $("#aiDifficulty").toggleClass("hide");
}
// Hide  the AI Difficulty menu
function hideOptions() {
    $("#aiDifficulty").addClass("hide");
}

/**
 * Change the 'mode' variable which will change whether or not the game is being played against an AI or a local human. 
 *
 * @param {number} mode
 */
Game.prototype.selectMode = function (mode) {
    this.mode = mode;
}

/***** These Functions are no longer useful, but are kept around just in case I need them ******/
/**
 * Change the color of each player's piece. By default the first player is red. 
 *
 * @param {number} color
 */
//Game.prototype.selectColor = function (color) {
//  this.color = color;
//}

/**
 * Change the order in Human vs AI (no meaning in Human vs Human) for whether the human player will go first or second.
 *
 * @param {boolean} first
 */
//Game.prototype.selectTurn = function (first) {
//   this.first = first;
//}


/**
 * Change the difficulty of the AI by depth. Easy is 2, medium is 4, hard is 6. The number represents how many moves ahead the AI sees 
 *
 * @param {number} difficulty
 */
Game.prototype.selectDifficulty = function (difficulty) {
    this.depth = difficulty;
}



/**
 * Switch turns depending on game mode
 *
 * @param {number} round
 * @return {number}
 */
Game.prototype.switchRound = function (round) {
    return this.mode == 1 ? (round == 0 ? 1 : 0) : (round == 0 ? 2 : 0);
}

/**
 * // This function is added as an event listener to the board. If it's the human's round then place wherever they clicked. If it's AI vs Human, and if it's the AI's turn, then generate a move for then.
 *
 * @param {event} e
 */
Game.prototype.act = function (e) {
    var element = e.target || window.event.srcElement;
    // Human round
    if (that.round == 0 || that.round == 2) {
        that.place(element.cellIndex);
    }
    if (that.mode == 1) {
        // Computer round
        if (that.round == 1) that.generateComputerDecision();
    } else {
        that.updateTurnIndicator();
    }
}

Game.prototype.updateTurnIndicator = function(){
    if (that.round == 0) {
        if (that.color == 0) {
            document.getElementById("current-turn-indicator").className = 'coin black-coin';
        } else {
            document.getElementById("current-turn-indicator").className = 'coin red-coin';
        }
    }
    else if (that.round == 2) {
        if (that.color == 0) {
            document.getElementById("current-turn-indicator").className = 'coin red-coin';
        } else {
            document.getElementById("current-turn-indicator").className = 'coin black-coin';
        }
    }
}
/**
 * Visually place a piece on the board. 
 *
 * @param {number} column
 * @returns {alert} / {nothing}
 */
Game.prototype.place = function (column) {
    // If the game isn't over. 
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        // For the bottom row (as in connect 4 the pieces drop)
        for (var y = this.board.rows - 1; y >= 0; y--) {
            // If the space is empty
            if (document.getElementById('game_board').rows[y].cells[column].className == 'empty') {
                // Setting 1: Player 1 is __, Player 2 / AI is ___.
                if (that.color == 0) {
                    if (that.round == 1 || that.round == 2) {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin red-coin';
                    } else {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin black-coin';
                    }
                }
                // Setting 2: Player 1 is __, Player 2 / AI is ___. 
                else {
                    if (that.round == 1 || that.round == 2) {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin black-coin';
                    } else {
                        document.getElementById('game_board').rows[y].cells[column].className = 'coin red-coin';
                    }
                }
                console.log(this.board.field);
                // Break from loop after inserting
                break;
            }
        }

        // If the piece can't be placed, then tell the player. 
        if (!that.board.place(column)) {
            return alert("Invalid move!");
        }
        // Swap Rounds
        that.round = that.switchRound(that.round);

         // Update the status of the game. 
         that.updateStatus();

      

       
    }
}

/**
 * Handle the AI control-wise.
 */
Game.prototype.generateComputerDecision = function () {
    var that = this;
    // If the game isn't over
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        // Iteration count reset; is used to show long an action took for debugging. 
        that.iterations = 0;
        // Loading message 
        document.getElementById('loading').style.display = "block";

        // AI is thinking (standarizes waiting time a little bit so the player doesn't feel off)
        setTimeout(function () {
            // Debug time
            var start = new Date().getTime();

            // Algorithm call
            var ai_move = that.AI.maximizePlay(that.board, that.depth);

            // After the algorithm call, get the amount of time it took the AI to make that call. 
            var end = new Date().getTime() - start;
            document.getElementById('ai-time').innerHTML = end.toFixed(2) + 'ms';

            // Place ai decision
            that.place(ai_move[0]);

            // Debug
            document.getElementById('ai-column').innerHTML = parseInt(ai_move[0] + 1);
            document.getElementById('ai-score').innerHTML = ai_move[1];
            document.getElementById('ai-iterations').innerHTML = that.iterations;

            // Remove loading message
            document.getElementById('loading').style.display = "none";
        }, 100);
    }
}

/**
 * Showing whether the game has been won, lost, tied, or is still running with alert and updating the DOM. 
 */
Game.prototype.updateStatus = function () {
    //  if(that.mode == 1){
    // Human won
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
        if (that.mode == 2) {
            document.getElementById('winner-indicator').innerHTML = "Player 1 Won!";
            // Swap Rounds
            console.log("Game won 1: " + that.round);
            console.log("Board won 1: " + that.board.player);
            that.round = that.switchRound(that.round);
            that.board.player = that.round;
            console.log("Game won 2: " + that.round);
            console.log("Board won 2: " + that.board.player);
            //      alert("Player 1 Has Won!");
        } else {
            document.getElementById('winner-indicator').innerHTML = "You Won!";
            //      alert("You have won!");
        }
        
    }

    // Computer won
    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
        if (that.mode == 2) {
            document.getElementById('winner-indicator').innerHTML = "Player 2 Won!";
            console.log("Game won 1: " + that.round);
            console.log("Board won 1: " + that.board.player);
             // Swap Rounds
             that.round = that.switchRound(that.round);
             that.board.player = that.round;
             console.log("Game won 2: " + that.round);
             console.log("Board won 2: " + that.board.player);
            //      alert("Player 2 Has Won!");
        } else {
            document.getElementById('winner-indicator').innerHTML = "You lost.";
            //       alert("You have lost!");
        }
    }
    // Tie
    if (that.board.isFull()) {
        if(that.mode == 2){
            console.log("Game won 1: " + that.round);
            console.log("Board won 1: " + that.board.player);
             // Swap Rounds
             that.round = that.switchRound(that.round);
             that.board.player = that.round;
             console.log("Game won 2: " + that.round);
             console.log("Board won 2: " + that.board.player);
        }
        that.status = 3;
        document.getElementById('winner-indicator').innerHTML = "Tie!";
    }

    if (that.mode == 1) {
        var html = document.getElementById('status');
        if (that.status == 0) {
            html.className = "status-running";
            html.innerHTML = "running";
        } else if (that.status == 1) {
            html.className = "status-won";
            html.innerHTML = "won";
        } else if (that.status == 2) {
            html.className = "status-lost";
            html.innerHTML = "lost";
        } else {
            html.className = "status-tie";
            html.innerHTML = "tie";
        }
    }
}

/**
 * Highlight the winning move on screen 
 */
Game.prototype.markWin = function () {
    document.getElementById('game_board').className = "finished";
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

/**
 * Restart Game button functionality
 */

Game.prototype.restartGame = function (depth) {
    // Get confirmation from the player that they want to restart the game for real
    if (confirm('Game is going to be restarted.\nAre you sure?')) {
        console.log("Board 1: " + this.board.player);
        console.log("Game 1: " + that.round);
        console.log("First: " +  that.first);
        if(confirm('Would you like to swap turns? If Player 1 was first, agreeing would make he or her second.')){
            that.first = !that.first;
            that.round = that.switchRound(that.round);
            this.board.player = that.round;
            console.log("Board 2: " + this.board.player);
            console.log("Game 2: " +that.round);
        }

        if (arguments.length != 0) {
            that.selectDifficulty(depth);
        }
        hideOptions();
        this.board.createBoard();
        this.createVisualBoard();
        this.resetStatus();
        this.resetVisuals();
        this.checkForComputerFirstMove();
        this.updateTurnIndicator();
        console.log("Board 3: " +this.board.player);
        console.log("Game 3: " +that.round);
    }
}

// Start a new game on load (even though the game hasn't starter yet, this object still handles the buttons to set up the game even though it's technically not been initationed by Game.init() )
function Start() {
    window.Game = new Game();
}

window.onload = function () {
    Start();
};
