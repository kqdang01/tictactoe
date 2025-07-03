const gameboard = (function () {
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    let player1;
    let player2;
    let currentMover;

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
                    clearButtonListeners();
                    return currentCell;
                }
                if (!i && boardArray[i+1][j] == currentCell && boardArray[i+2][j] == currentCell)
                {
                    console.log(currentCell + " wins! column");
                    clearButtonListeners();
                    return currentCell;
                }
                if (i == 1 && j == 1)
                {
                    if ((boardArray[0][0] == currentCell && boardArray[2][2] == currentCell) || (boardArray[0][2] == currentCell && boardArray[2][0] == currentCell))
                    {
                        console.log(currentCell + " wins! diagonal");
                        clearButtonListeners();
                        return currentCell;
                    }
                }
            }
        }
        if (tie)
        {
            console.log("game tied!");
            return "tie";
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

function updateGameText(status)
{   
    const headerText = document.querySelector(".winnerText");
    const player1Score = document.querySelector(".p1score");
    const player2Score = document.querySelector(".p2score");
    
    headerText.textContent = `${gameboard.currentMover.name}'s Turn`;
    if (gameboard.player1.mark == status)
    {
        headerText.textContent = `${gameboard.player1.name} wins!`;
        gameboard.player1.givePoint();
    }
    else if (gameboard.player2.mark == status)
    {
        headerText.textContent = `${gameboard.player2.name} wins!`;
        gameboard.player2.givePoint();
    }
    if (status == "tie")
    {
        headerText.textContent = "Tie!";
    }
    player1Score.textContent = gameboard.player1.points;
    player2Score.textContent = gameboard.player2.points;
}

function clearButtonListeners()
{
    const buttons = document.querySelectorAll("button");
    for (button of buttons)
    {
        button.removeEventListener("click", playButton);
    }
}

function playButton()
{
    const coords = this.textContent.split(" ");
    if (gameboard.currentMover.playPiece(coords[1], coords[0]))
    {
        this.className = gameboard.currentMover.mark;
        this.removeEventListener("click", playButton);
        if (gameboard.currentMover == gameboard.player1)
            {
                gameboard.currentMover = gameboard.player2;
            } 
            else if (gameboard.currentMover == gameboard.player2)
            {
                gameboard.currentMover = gameboard.player1;
            }
    }
    updateGameText(gameboard.scanBoard());
}

function playRound(player1 = "player1", player2 = "player2")
{
    const buttons = document.querySelectorAll("button");
    let players = [player1, player2];
    let firstMover = players[Math.round(Math.random())];
    players.splice(players.indexOf(firstMover), 1);
    let secondMover = players[0];
    console.table(firstMover);
    gameboard.player1 = firstMover;
    gameboard.player2 = secondMover;
    gameboard.currentMover = firstMover;

    let count = 0;
    for (button of buttons)
    {
        button.addEventListener("click", playButton);
    }
}