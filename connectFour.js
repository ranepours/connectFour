let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; //active player (1 or 2)
let board = []; //array of rows (board[y][x])

//MAKE BOARD
makeBoard = () => {
    //set board to empty HEIGHT X WIDTH array
    for (let y = 0; y < HEIGHT; y++){
        board.push(Array.from({length: WIDTH}));
    }
}
makeHTMLBoard = () => {
    //get htmlBoard variable from item in HTML
    const board = document.querySelector('#board')
    //add comment for the following code: makes clickables for the game => click and add game piece to selected column
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', handleClick);

    for(let x = 0; x < WIDTH; x++){
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
    }
    board.append(top);

    //add comment for code: make 'game' part of board => where the pieces are gonna show
    for(let y = 0; y < HEIGHT; y++){
        const row = document.createElement('tr');
        for(let x = 0; x < WIDTH; x++){
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
        }
        board.append(row);
    }
}

//given column x, return top empty y (null if filled)
findSpotForCol = (x) => {
    for(let y = HEIGHT - 1; y >= 0; y--){
        if(!board[y][x]){
            return y;
        }
    }
    return null;
}

//update DOM to place piece into HTML table of board
placeInTable = (y, x) => {
    //make div and insert into correct table cell
    const gamePiece = document.createElement('div');
    gamePiece.classList.add('game-piece');
    gamePiece.classList.add(`player-${currPlayer}`);

    const where = document.getElementById(`${y}-${x}`); //finds WHERE to append game piece and then puts it there below (miiiiight have peeked for this)
    where.append(gamePiece);
}

//endGame
endGame = (msg) => {
    //setTimeout so message displays AFTER the move is played
    setTimeout(() => {
        alert(msg);
        location.reload();
    }, 150); //displays fast so no room to play again, then reloads game
}

//handleClick to play piece
handleClick = (e) => {
    //grab x from ID of clicked cell
    let x = +e.target.id;

    //get next spot in column (if none, ignore)
    let y = findSpotForCol(x);
    if(y === null){
        return;
    }

    //place piece in board
    board[y][x] = currPlayer;
        //update in-memory board
    placeInTable(y,x);

    //check for win
    if(checkForWin()){
        return endGame(`Player ${currPlayer} prevails!`);
    }
    //check for tie => use EVERY bc EVERYcell should be full for there to be a tie :)
    if(board.every(row => row.every(cell => cell))){
        return endGame("No winners, no losers... It's a stalemate.");
    }

    //switch players
    currPlayer = currPlayer === 1 ? 2 : 1; //if current player is p1, change to p2 else leave as p1
}

//check board cell by cell for win
checkForWin = () => {
    _win = (cells) => {
        //check four cells to see if each color matches ONE player
        /* cells: list of four (y,x) cells
        returns true if all are legal coordinates and match one player or the other */
        return cells.every(
            ([y,x]) => 
                y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH &&
                board[y][x] === currPlayer
        );
    }
    //read and understand the following: (add comments!)
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
        //checks 4 cells for diff ways to win the game
            var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
            //if one of these returns true then the win is valid and winner is announced
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
      }
}

makeBoard();
makeHTMLBoard();