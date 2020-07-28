let board;
let game = new Chess();


// minimax functions

// returns the current best move
let minimaxRoot =function(depth, game, isMax) {

    let newMoves = game.ugly_moves();
    let best = -9999;
    let bestFound;

    for(let i = 0; i < newMoves.length; i++) {
        let newMove = newMoves[i]
        game.ugly_move(newMove);
        let value = minimax(depth - 1, game, -10000, 10000, !isMax);
        game.undo(); //undo() takes back the last half-move & returns move object
        
        //if value of newMove is greater than value of bestMove, bestMove set to value
        //and bestPlayerMove set to newMove
        if(value >= best) {
            best = value;
            bestFound = newMove;
        }
    }
    return bestFound; //returns best move based on 'value'
}; 

// returns the value of the best move for the current player
let minimax = function (depth, game, alpha, beta, isMax) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    let newMoves = game.ugly_moves();

    // if the current player is the maximizing player then get the move with the highest score
    if (isMax) {
        let best = -9999;
        // make each move, check the value of the board, then undo the move
        for (let i = 0; i < newMoves.length; i++) {
            game.ugly_move(newMoves[i]);
            best = Math.max(best, minimax(depth - 1, game, alpha, beta, !isMax));
            game.undo();
            // updates the alpha value if the best move is better than the current alpha
            alpha = Math.max(alpha, best);
            // if black already has a better move and therefore won't go down this path,
            // return the current value of best without wasting any more time on needless computation
            if (beta <= alpha) {
                return best;
            }
        }
        // return score of the board state base on the data for the best move found for white (assuming optimal play from black)
        return best;
    } else {
        // initialize best move as basically infinity for comparison
        let best = 9999;
        // make each move, check the value of the board, then undo the move
        for (let i = 0; i < newMoves.length; i++) {
            game.ugly_move(newMoves[i]);
            best = Math.min(best, minimax(depth - 1, game, alpha, beta, !isMax));
            game.undo();

            // updates the beta value if the bestMove is better (for black) than the current beta
            beta = Math.min(beta, best);

            //if white already has a better move and therefore won't go down this path,
            // return the current value of bestMove without wasting any more time on needless computation
            if (beta <= alpha) {
                return best;
            }
        }
        // return score of the board state base on the data for the best move found for black (assuming optimal play from white)
        return best;
    }
};

// returns numerical evaluation of the passed board state
// positive if white is favored and negative if black is favored
let evaluateBoard = function (board) {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

// value matrices to augment the strength of the evaluation function specific to each piece
let pawnEvalWhite = [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

// reverses only the outer array, effectively flipping the matrix about the x-axis so it becomes accurate for black
let pawnEvalBlack = pawnEvalWhite.slice().reverse();

let knightEval = [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

let bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

let bishopEvalBlack = bishopEvalWhite.slice().reverse();

let rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

let rookEvalBlack = rookEvalWhite.slice().reverse();

let evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

let kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

let kingEvalBlack = kingEvalWhite.slice().reverse();



//checks .type() of piece, returns abs value if not null
let getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    let getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    let absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    // returns positive value if white, otherwise returns negative value
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


// functions dealing with board state

// called when the user trys to drag a piece
let onDragStart = function (source, piece, position, orientation) {
    // if the square is blank or the game is over, don't allow drag
    if (game.in_checkmate() || game.in_draw() || piece.search(/^b/) !== -1) {
        return false;
    }
};

let makeBestMove = function () {
    let bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    // if the game is over triggers window pop-up
    if (game.game_over()) {
        alert('Game over');
    }
};


let positionCount;
let getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    let depth = parseInt($('#search-depth').find(':selected').text());

    let d = new Date().getTime();
    let bestMove = minimaxRoot(depth, game, true);
    let d2 = new Date().getTime();
    let moveTime = (d2 - d);
    let positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

let renderMoveHistory = function (moves) {
    let historyElement = $('#move-history').empty();
    historyElement.empty();
    for (let i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

let onDrop = function (source, target) {

    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

let onSnapEnd = function () {
    board.position(game.fen());
};

let onMouseoverSquare = function(square, piece) {
    let moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

let onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

let removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

let greySquare = function(square) {
    let squareEl = $('#board .square-' + square);

    let background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d')) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

let cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);