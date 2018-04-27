/**
 * Creates an instance of Board.
 * 
 * @constructor
 * @this {Board}
 * @param {Game} game The main-game object. 
 * @param {array} field The field containing our situation.
 * @param {number} player The current player.
 */
function Board(game, field, player) {
    this.game = game;
    this.field = field;
    this.player = player;
    this.rows = 6; // Height
    this.columns = 7; // Width
}

Board.prototype.createBoard = function () {
    for (var i = 0; i < this.rows; i++) {
        this.field[i] = [];
        for (var j = 0; j < this.columns; j++) {
            this.field[i][j] = null;
        }
    }
}

/**
 * Determines if the recursion is finished. 
 *
 * @param {number} depth
 * @param {number} score
 * @return {boolean}
 */
Board.prototype.isFinished = function (depth, score) {
    // If either the game has ended or the depth of the recursion is ended. 
    if (depth == 0 || score == this.game.score || score == -this.game.score || this.isFull()) {
        return true;
    }
    return false;
}

/**
 * Place a player's chip into the board variabe. Also used to check if a move can be done. 
 *
 * @param {number} column
 * @return {boolean} 
 */
Board.prototype.place = function (column) {
    console.log(this.field);
    console.log("Place player: " + this.player);
    // Check if column valid
    // 1. not empty 2. not exceeding the board size
    if (this.field[0][column] == null && column >= 0 && column < this.columns) {
        // Bottom to top
        for (var y = this.rows - 1; y >= 0; y--) {
            if (this.field[y][column] == null) {
                // Set current player coin
                this.field[y][column] = this.player;
                // Break from loop after inserting
                break;
            }
        }
        // Swap the players for the board object. 
        this.player = this.game.switchRound(this.player);
        // We placed a piece so return true that we could do that
        return true;
    } else {
        // We couldn't place the piece and therefore return false 
        return false;
    }
}

/**
 * Check if the param player has won. Return true if yes, return false if no.  
 *
 * @param {number} player
 * @return {boolean} 
 */
Board.prototype.checkVictory = function (player) {
    // horizontalCheck
    for (var j = 0; j < this.columns - 3; j++) {
        for (var i = 0; i < this.rows; i++) {
            if (
                this.field[i][j] === player &&
                this.field[i][j + 1] === player &&
                this.field[i][j + 2] === player &&
                this.field[i][j + 3] === player
            ) {

                return true;
            }
        }
    }
    // verticalCheck
    for (var i = 0; i < this.rows - 3; i++) {
        for (var j = 0; j < this.columns; j++) {
            if (
                this.field[i][j] == player &&
                this.field[i + 1][j] == player &&
                this.field[i + 2][j] == player &&
                this.field[i + 3][j] == player
            ) {
                return true;
            }
        }
    }
    // ascendingDiagonalCheck. Left bottom top right.
    for (var i = 3; i < this.rows; i++) {
        for (var j = 0; j < this.columns - 3; j++) {
            if (
                this.field[i][j] == player &&
                this.field[i - 1][j + 1] == player &&
                this.field[i - 2][j + 2] == player &&
                this.field[i - 3][j + 3] == player
            ) {
                return true;
            }
        }
    }
    // descendingDiagonalCheck. Left top bottom right 
    for (var i = 3; i < this.rows; i++) {
        for (var j = 3; j < this.columns; j++) {
            if (
                this.field[i][j] == player &&
                this.field[i - 1][j - 1] == player &&
                this.field[i - 2][j - 2] == player &&
                this.field[i - 3][j - 3] == player
            ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Return a score for various positions (either horizontal, vertical or diagonal by moving through our board).
 * Used by the AI to determine how to play the gamme. If this function was not here, then the variables would be meaningless to it.
 * @param {number} row
 * @param {number} column
 * @param {number} delta_y
 * @param {number} delta_x
 * @return {number}
 */
Board.prototype.scorePosition = function (row, column, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) {
        if (this.field[row][column] == 0) {
            this.game.winning_array_human.push([row, column]);
            // Add for each human chip
            human_points++;
        } else if (this.field[row][column] == 1 || this.field[row][column] == 2) {
            this.game.winning_array_cpu.push([row, column]);
            // Add for each computer chip
            computer_points++;
        }
        // Moving through our board
        row += delta_y;
        column += delta_x;
    }
    // Marking winning/returning score
    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        // Human won (100000)
        return -this.game.score;
    } else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        // Computer won (-100000)
        return this.game.score;
    } else {
        // Return normal points
        return computer_points;
    }
}

/**
 * Returns the overall score for our board.
 *
 * @return {number}
 */
Board.prototype.score = function () {

    var points = 0;

    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    // Board-size: 7x6 (height x width)
    // Array indices begin with 0
    // => e.g. height: 0, 1, 2, 3, 4, 5

    // Vertical points
    // Check each column for vertical score
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [x][x][ ][ ][ ][ ][ ] 1
    // [x][x][x][ ][ ][ ][ ] 2
    // [x][x][x][ ][ ][ ][ ] 3
    // [ ][x][x][ ][ ][ ][ ] 4
    // [ ][ ][x][ ][ ][ ][ ] 5
    for (var row = 0; row < this.rows - 3; row++) {
        // Check for each column
        for (var column = 0; column < this.columns; column++) {
            // Rate the column and add to the points
            var score = this.scorePosition(row, column, 1, 0);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            vertical_points += score;
        }
    }

    // Horizontal points
    // Check each row's score
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][x][x][x][ ][ ][ ] 0
    // [ ][x][x][x][x][ ][ ] 1
    // [ ][ ][x][x][x][x][ ] 2
    // [ ][ ][ ][x][x][x][x] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < this.rows; row++) {
        for (var column = 0; column < this.columns - 3; column++) {
            var score = this.scorePosition(row, column, 0, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            horizontal_points += score;
        }
    }

    // Diagonal points 1 (left-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [ ][x][ ][ ][ ][ ][ ] 1
    // [ ][ ][x][ ][ ][ ][ ] 2
    // [ ][ ][ ][x][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < this.rows - 3; row++) {
        for (var column = 0; column < this.columns - 3; column++) {
            var score = this.scorePosition(row, column, 1, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points1 += score;
        }
    }

    // Diagonal points 2 (right-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [ ][ ][ ][x][ ][ ][ ] 0
    // [ ][ ][x][ ][ ][ ][ ] 1
    // [ ][x][ ][ ][ ][ ][ ] 2
    // [x][ ][ ][ ][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 3; row < this.rows; row++) {
        for (var column = 0; column <= this.columns - 4; column++) {
            var score = this.scorePosition(row, column, -1, +1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points2 += score;
        }

    }
    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
}

/**
 * Determines if board is full.
 *
 * @return {boolean}
 */
Board.prototype.isFull = function () {
    for (var i = 0; i < this.columns; i++) {
        if (this.field[0][i] == null) {
            return false;
        }
    }
    return true;
}

/**
 * Returns a copy of our board for recursion purposes. 
 *
 * @return {Board}
 */
Board.prototype.copy = function () {
    var new_board = new Array();
    for (var i = 0; i < this.field.length; i++) {
        new_board.push(this.field[i].slice());
    }
    return new Board(this.game, new_board, this.player);
}
