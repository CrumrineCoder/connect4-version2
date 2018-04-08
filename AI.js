/**
 * Creates an instance of AI.
 * 
 * @constructor
 * @this {AI}
 * @param {Game} game The main-game object. 
 */
function AI(game) {
    this.game = game;
}
/**
 * Algorithm
 * Minimax principle with Alpha Beta Pruning 
 */
AI.prototype.maximizePlay = function (board, depth, alpha, beta) {
    // Call score of our board
    var score = board.score();

    // Break
    if (board.isFinished(depth, score)) return [null, score];

    // Column, Score
    var max = [null, -99999];

    // For all possible moves
    for (var column = 0; column < this.game.board.columns; column++) {
        // Create new board
        var new_board = board.copy();

        if (new_board.place(column)) {

            this.game.iterations++;

            var next_move = this.minimizePlay(new_board, depth - 1, alpha, beta); // Recursive calling

            // Evaluate new move to maximize 
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
                alpha = next_move[1];
            }
            // Alpha - Beta pruning
            if (alpha >= beta) return max;
        }
    }
    return max;
}

AI.prototype.minimizePlay = function (board, depth, alpha, beta) {
    var score = board.score();

    // Break 
    if (board.isFinished(depth, score)) return [null, score];

    // Column, score
    var min = [null, 99999];

    // For all possible moves
    for (var column = 0; column < this.game.board.columns; column++) {
        // Create new board
        var new_board = board.copy();

        if (new_board.place(column)) {


            this.game.iterations++;

            var next_move = this.maximizePlay(new_board, depth - 1, alpha, beta);

            // Evaluate new move to minimize 
            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            // Alpha - Beta pruning
            if (alpha >= beta) return min;

        }
    }
    return min;
}