const gameboard = (function () {
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const scanBoard = () => {
        let tie = true;
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                let currentCell = boardArray[i][j];
                if (currentCell == null)
                {
                    tie = false;
                    continue;
                }
                if (!j && boardArray[i][j+1] == currentCell && boardArray[i][j+2] == currentCell)
                {
                    console.log(currentCell + " wins! row");
                    return true;
                }
                if (!i && boardArray[i+1][j] == currentCell && boardArray[i+2][j] == currentCell)
                {
                    console.log(currentCell + " wins! column");
                    return true;
                }
                if (i == 1 && j == 1)
                {
                    if ((boardArray[0][0] == currentCell && boardArray[2][2] == currentCell) || (boardArray[0][2] == currentCell && boardArray[2][0] == currentCell))
                    {
                        console.log(currentCell + " wins! diagonal");
                        return true;
                    }
                }
            }
        }
        if (tie)
        {
            console.log("game tied!");
            return true;
        }
    }

    const resetBoard = () => {
        for(let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                boardArray[i][j] = null;
            }
        }
    }
    return {boardArray, scanBoard, resetBoard};
})();

function createPlayer(name, mark)
{
    let points = 0;

    const playPiece = (x, y) => {
        if (x > 2 || x < 0 || y > 2 || y < 0 || gameboard.boardArray[y][x] != null)
        {
            console.log("YOU CANT PLACE HERE");
            return false;
        }
        else
        {
            gameboard.boardArray[y][x] = mark;
        }
        console.table(gameboard.boardArray);
        return true;
    }

    const givePoint = () => points++;
    const resetPoints = () => points = 0;
    return {name, mark, points, playPiece, givePoint, resetPoints};
}

function playRound(player1, player2)
{
    let players = [player1, player2];
    let firstMover = players[Math.round(Math.random())];
    players.splice(players.indexOf(firstMover), 1);
    let secondMover = players[0];

    while(!firstMover.playPiece(prompt(firstMover.name + " : Enter X Cord: "), prompt(firstMover.name + " : Enter Y Cord: ")));
    while (1)
    {
        while(!secondMover.playPiece(prompt(secondMover.name + " : Enter X Cord: "), prompt(secondMover.name + " : Enter Y Cord: ")));
        if (gameboard.scanBoard()) break;
        while(!firstMover.playPiece(prompt(firstMover.name + " : Enter X Cord: "), prompt(firstMover.name + " : Enter Y Cord: ")));
        if (gameboard.scanBoard()) break;
    }
}