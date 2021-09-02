window.onload = function() {

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

        setInterval(function() {
            t += 0.04;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x1 + (x2-x1)*t, y1 + (y2-y1)*t);
            ctx.stroke();
        }, 15);


    };
    return {drawLine}
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
//function to determine if the game is a draw
//flip turn
//
//Public:
//function that runs after every turn
//function to return whose turn it is
let GameLogic = (function(){
    //private
    let turn = 'X';
    
    const hasGameWon = (board) => {

    };
    const hasGamedrawn = (board) => {};
    const switchTurn = () => {
        if(turn == 'X') {
            turn = 'O';
        }
        else {
            turn = 'X';
        }
    };

    //public
    const runEveryTurn = (board) => {
        hasGameWon(board);
        hasGameDrawn(board);
    };
    const whoseTurn = () => {return turn;}

    return {runEveryTurn, whoseTurn}
})();

// Manages the board
//
// Private:
// Stores an array of what is to be displayed on the board
//
// Public:
// function to return current state of the board
// function to add an X on a given square 
// function to add an O on a given square
// function to initialize to board
let GameBoard = (function(){
    //private
    let board = [null, null, null, null, null, null, null, null, null];
    
    //public
    const getBoard = () => board;
    const addX = (index) => board[index] = 'X';
    const addO = (index) => board[index] = 'O';
    const initializeBoard = () => {
        board = [null, null, null, null, null, null, null, null, null];
        const cells = document.querySelectorAll('.grid__item');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                cell.innerText = GameLogic.whoseTurn();
                board[cell.getAttribute('data-key')-1] = cell.innerText;
                console.log(board);
            });
        });
    }

    return {getBoard, addX, addO, initializeBoard}
})();

const Player = () => {
    //private

    //public

    return {}
};

GameBoard.initializeBoard();
