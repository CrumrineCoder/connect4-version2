
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

    this.round = 0; // 0: Human, 1: Computer
    this.mode = 1; // 1: Human vs AI, 2: Human vs Human
    this.color = 1; // 0: Black = player 1, red = player 2 / AI; 1: Red vice versa.
    this.first = true; // true if player 1 is going first, false if the AI/Player 2 is going first

    that = this;
}

/**
 * Start a new game function
 */
Game.prototype.init = function () {
    document.getElementById("current-turn-indicator").className = '';
    document.getElementById('winner-indicator').innerHTML = "";
    document.getElementById('ai-iterations').innerHTML = "?";
        document.getElementById('ai-time').innerHTML = "?";
        document.getElementById('ai-column').innerHTML = "?";
        document.getElementById('ai-score').innerHTML = "?";
        document.getElementById('game_board').className = "";
  
    if (that.first) {
        that.round = 0;
    } else {
        if (that.mode == 2) {
            that.round = 2;
        }
    }

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

    console.log("First: " + this.first);
    console.log("Player: " + this.round)
    //   document.getElementById("turn-display").innerHTML = "";

    // Create from board object (see board.js)
    // If the player is going first, load it with the local round var. If not, swap it. 
    if (that.first) {
        this.round = that.round; 
        
    } else {
        this.round = that.switchRound(that.round); 
    }
    this.board = new Board(this, [], this.round);
    console.log("Player after: " + this.round)
    // This fills in a 2d board var with null for every column and row in the board object.
    this.board.createBoard();
    // Only if the game is Human vs AI will we load in an AI object
    if (that.mode == 1) {
        this.AI = new AI(this);
    } else {
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
    // Create the visual board HTMl to be shown to the player 
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

    // If the game is Human vs AI and the player is going second, then go an AI move before the player's first move. 
    if (!that.first && that.mode == 1) {
        that.round = that.switchRound(that.round);
        that.generateComputerDecision();
    }
    var html = document.getElementById('status');
    html.className = "status-running";
    html.innerHTML = "running";
}

function toggleMenu() {
    $("#main-menu").toggleClass("hide");
    $("#container").toggleClass("hide");
    hideOptions();
    if (this.Game.mode == 1) {
        $("#aiDiffButton").removeClass("hide");
        $("#debug").removeClass("hide");
    } else {
        $("#aiDiffButton").addClass("hide");
        $("#debug").addClass("hide");
    }
}

function toggleOption(){
    $("#aiDifficulty").toggleClass("hide");
}

function hideOptions(){
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
    } else{
        if (that.round == 0) {
            document.getElementById("current-turn-indicator").className = 'coin red-coin';
            //      document.getElementById().innerHTML = "First player's  turn";
        }
        else if (that.round == 2) {
            document.getElementById("current-turn-indicator").className = 'coin black-coin';
            //      document.getElementById("current-turn-indicator").innerHTML = "Second player's  turn";
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
            document.getElementById('ai-column').innerHTML =  parseInt(ai_move[0] + 1);
            document.getElementById('ai-score').innerHTML =  ai_move[1];
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
      //      alert("Player 2 Has Won!");
        } else {
            document.getElementById('winner-indicator').innerHTML = "You lost.";
     //       alert("You have lost!");
        }
    }

    /*  } else{
          if(that.board.checkVictory(0)){
              console.log("1p won");
              that.status = 1; 
              that.markWin();
              alert("Player One Has Won!");
          }
          
          if(that.board.checkVictory(2)){
              console.log("2p won");
              that.status = 1; 
              that.markWin();
              alert("Player Two Has Won!");
          }
  
      } */
    // Tie
    if (that.board.isFull()) {
        that.status = 3;
        alert("Tie!");
    }

    if(that.mode == 1){
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
        if(arguments.length != 0){
            that.selectDifficulty(depth);
   
        //    that.depth = depth; 
        }
        hideOptions();
        document.getElementById('winner-indicator').innerHTML = "";
        that.status = 0;
        that.first = !that.first;
        that.board.player = this.switchRound;
     //   var depth = difficulty.options[difficulty.selectedIndex].value;
    //    that.depth = depth;
        // Initialize a new  Game Object
        that.init();
        // Reset debug messages
        document.getElementById('ai-iterations').innerHTML = "?";
        document.getElementById('ai-time').innerHTML = "?";
        document.getElementById('ai-column').innerHTML = "?";
        document.getElementById('ai-score').innerHTML = "?";
        document.getElementById('game_board').className = "";
        // Update status of the game
        that.updateStatus();
    }
}

// Start a new game on load (even though the game hasn't starter yet, this object still handles the buttons to set up the game even though it's technically not been initationed by Game.init() )
function Start() {
    
    window.Game = new Game();
}

window.onload = function () {
    Start()
};
