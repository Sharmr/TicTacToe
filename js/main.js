let AI = false;

window.onload = function() {
    GameController.startNewGame();
    const restart = document.getElementById('restart');
    restart.addEventListener('click', () => {GameBoard.initializeBoard()});
    const restartAI = document.getElementById('restart-AI');
    restartAI.addEventListener('click', () => {AI = true; console.log(AI);GameBoard.initializeBoard();GameController.turn();});
}

let DisplayController = (function(){
    //private

    //public
    const drawLine = (x1, y1, x2, y2) => {
        const canvas = document.querySelector('canvas');
        console.log(canvas);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.beginPath();
        let t = 0;
        setInterval(function() {
            t += 0.04;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x1 + (x2-x1)*t, y1 + (y2-y1)*t);
            ctx.stroke();
        }, 15);
    };
    const clearLines = () => {
        let c = document.querySelector('canvas');
        c.remove();
        c = document.createElement('canvas');
        c.height = 700;
        c.width = 700;
        const body = document.querySelector('.grid');
        body.appendChild(c);
    };
    return {drawLine, clearLines}
})();

//Determines whether it's X's turn or O's turn.
//Determines whether there is a winner
//Determines whether the game is a draw
//if there's no draw, determines the winner.
//
//Private:
//Variable that tells us whose turn it is
//function to determine winner
//function to determine if an endgame has been reached
//flip turn
//
//Public:
//function that runs after every turn
//function to return whose turn it is
let GameLogic = (function(){
    //private
    let turn = 'X';
    
    const hasGameWon = (board) => {
        let gameWon = false;
        for(let i=0; i<3; i++) {
            if(board[i] == board[i+3] && board[i] == board[i+6] && (board[i] == 'X' || board[i] == 'O')){
                DisplayController.drawLine((2*i+1)*(700/6), 0, (2*i+1)*(700/6), 700);
                gameWon = true;
            }
            if(board[3*i] == board[3*i+1] && board[3*i] == board[3*i+2] && (board[3*i] == 'X' || board[3*i] == 'O')){
                DisplayController.drawLine(0, (2*i+1)*(700/6), 700, (2*i+1)*(700/6));
                gameWon = true;
            }
        }
        if(board[0] == board[4] && board[0] == board[8] && (board[0] == 'X' || board[0] == 'O')) {
            DisplayController.drawLine(0,0,700,700);
            gameWon = true;
        }
        if(board[2] == board[4] && board[2] == board[6] && (board[2] == 'X' || board[2] == 'O')) {
            DisplayController.drawLine(700,0,0,700);
            gameWon = true;
        }
        if(gameWon) {
            GameBoard.unintializeGameBoard();
        }
        else if(!board.includes(null)) {
            console.log('draw');
            alert('draw');
        }

    };
    
    const gameWinner = (board) => {
        let winner = null;

        for(let i=0; i<3; i++) {
            if(board[i] == board[i+3] && board[i] == board[i+6] && (board[i] == 'X' || board[i] == 'O')){
                winner = board[i];
            }
            if(board[3*i] == board[3*i+1] && board[3*i] == board[3*i+2] && (board[3*i] == 'X' || board[3*i] == 'O')){
                winner = board[3*i];
            }
        }
        if(board[0] == board[4] && board[0] == board[8] && (board[0] == 'X' || board[0] == 'O')) {
            winner = board[0];
        }
        if(board[2] == board[4] && board[2] == board[6] && (board[2] == 'X' || board[2] == 'O')) {
            winner = board[2];
        }
        return winner;
    };

    

    const getValidMoves = (board) => {
        let valid = [];
        for(let i = 0; i < board.length; i++){
            if(board[i]==null || board[i] == undefined) {
                valid.push(i);
            }
        }
        return valid;
    };

    const getBestMove = (board,depth) => {
        let containment_board = []
        for(let i = 0; i < board.length; i++){
            containment_board.push(board[i])
        }
        let max_value = -10000;
        let best_move = -1;
        let valid_moves = getValidMoves(containment_board);
        console.log(" ");
        for(let i = 0; i< valid_moves.length; i++) {
            let new_board = [...containment_board];
            new_board[valid_moves[i]] = 'X'
            let current_value = moveFinder(new_board,depth,'O');
            console.log('move: '+valid_moves[i]+' score: '+current_value);
            if(current_value > max_value) {
                max_value = current_value;
                best_move = valid_moves[i];
            }
        }
        return best_move + 1;
    };

    const moveFinder = (board, depth, t) => {

        if(depth == 0) {
            return 0;
        }
        if(gameWinner(board) == 'X'){
            return 100-(5-depth);
        }
        if(gameWinner(board) == 'O'){
            return -100+(5-depth);
        }
        let valid_moves = getValidMoves(board);
        if(t == 'X') {
            let move_value = -100;
            for(let i = 0; i < valid_moves.length; i++) {
                let new_board = [...board];
                new_board[valid_moves[i]] = 'X';
                let current = moveFinder(new_board,depth-1, 'O');
                if(move_value <= current){
                    move_value = current;
                }
            }
            return move_value;
        }
        if(t == 'O') {
            let move_value = 100;
            for(let i = 0; i < valid_moves.length; i++) {
                let new_board = [...board];
                new_board[valid_moves[i]] = 'O';
                let current = moveFinder(new_board,depth-1, 'X');
                if(move_value >= current){
                    move_value = current;
                }
            }
            return move_value;
        }
    }

    //public
    const switchTurn = () => {
        if(turn == 'X') {
            turn = 'O';
        }
        else {
            turn = 'X';
        }
    };
    const resetTurn = () => {
        turn = 'X';
    };
    const runEveryTurn = (board) => {
        hasGameWon(board);
        if(turn == 'X' && AI) {
            computerPlay(board, 5);
        }
        //switchTurn();
    };
    const whoseTurn = () => {return turn;}
    const computerPlay = (board, depth) => {
        //determine best move and play it
        let best_move = 5;
        let empty =[null, null, null, null, null, null, null, null, null];
        if(!(board.every((element, index)=> {return element === empty[index];}))){
            best_move = getBestMove(board, depth);
        }
        best_move = best_move;
        document.querySelector("[data-key = '"+best_move+"']").click();

    };
    return {runEveryTurn, whoseTurn, switchTurn, resetTurn, computerPlay}
})();

// Manages the board
//
// Private:
// Stores an array of what is to be displayed on the board
//
// Public:
// function to return current state of the board
// function to initialize to board
let GameBoard = (function(){
    //private
    let board = [null, null, null, null, null, null, null, null, null];
    const initializeCell = (e) => {
        e.target.innerText = GameLogic.whoseTurn();
        board[e.target.getAttribute('data-key')-1] = e.target.innerText;
        GameLogic.switchTurn();
        GameController.turn();
        e.target.removeEventListener('click',initializeCell);
    };
    const hoverText = (e) => {
        if(e.target.innerText == ""){
            e.target.innerText = GameLogic.whoseTurn();
        }
    };
    const redrawBoard = () => {
        const cells = document.querySelectorAll('.grid__item');
        cells.forEach(cell => {
            cell.innerText = board[cell.getAttribute('data-key')-1];
        })
    };
    const removeHoverText = (e) => {
        e.target.innerText = null;
        redrawBoard();
    };
    //public
    const getBoard = () => board;
    const initializeBoard = () => {
        board = [null, null, null, null, null, null, null, null, null];
        redrawBoard();
        GameLogic.resetTurn();
        DisplayController.clearLines();
        const cells = document.querySelectorAll('.grid__item');
        cells.forEach(cell => {
            cell.innerText = "";
            cell.addEventListener('click', initializeCell);
            cell.addEventListener('mouseover', hoverText);
            cell.addEventListener('mouseout', removeHoverText)
        });
    }
    const unintializeGameBoard = () => {
        const cells = document.querySelectorAll('.grid__item');
        cells.forEach(cell => {
            cell.removeEventListener('click', initializeCell);
            cell.removeEventListener('mouseover', hoverText);
            cell.removeEventListener('mouseout', removeHoverText)
        })
    }

    return {getBoard, initializeBoard, unintializeGameBoard}
})();


let GameController = (function(){
    //private
    //public
    const startNewGame = () => {
        GameBoard.initializeBoard();
    };
    const turn = () => {
        GameLogic.runEveryTurn(GameBoard.getBoard());
    }
    return {startNewGame, turn}
})();



