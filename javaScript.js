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
                    endGame();
                    return currentCell;
                }
                if (!i && boardArray[i+1][j] == currentCell && boardArray[i+2][j] == currentCell)
                {
                    console.log(currentCell + " wins! column");
                    endGame();
                    return currentCell;
                }
                if (i == 1 && j == 1)
                {
                    if ((boardArray[0][0] == currentCell && boardArray[2][2] == currentCell) || (boardArray[0][2] == currentCell && boardArray[2][0] == currentCell))
                    {
                        console.log(currentCell + " wins! diagonal");
                        endGame();
                        return currentCell;
                    }
                }
            }
        }
        if (tie)
        {
            console.log("game tied!");
            endGame();
            return "tie";
        }
    }

    const resetBoard = () => {
        const buttons = document.querySelectorAll("#game");
        clearButtonListeners();
        for (button of buttons)
        {
            button.className = "";
        }
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
    const getPoints = () => points;
    const resetPoints = () => points = 0;
    return {name, mark, points, playPiece, givePoint, resetPoints, getPoints};
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
    player1Score.textContent = gameboard.player1.getPoints();
    player2Score.textContent = gameboard.player2.getPoints();
}

function clearButtonListeners()
{
    const buttons = document.querySelectorAll("#game");
    for (button of buttons)
    {
        button.removeEventListener("click", playButton);
        button.removeEventListener("click", playRound);
    }
}

function endGame()
{
    const buttons = document.querySelectorAll("#game");
    clearButtonListeners();
    for (button of buttons)
    {
        button.addEventListener("click", playRound);
    }
}

function playButton()
{
    const coords = this.textContent.split(" ");
    const p1Name = document.querySelector(".p1name");
    const p2Name = document.querySelector(".p2name");
    gameboard.player1.name = p1Name.value;
    gameboard.player2.name = p2Name.value;
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

function playRound()
{
    if (!gameboard.player1)
    {
        gameboard.player1 = createPlayer("Player 1", "X");
        gameboard.player2 = createPlayer("Player 2", "O");

        const resetButton = document.querySelector(".reset");
        resetButton.addEventListener("click", () => {
            gameboard.player1.resetPoints();
            gameboard.player2.resetPoints();
            playRound();
            updateGameText();
        })
    }
    
    const buttons = document.querySelectorAll("#game");
    let players = [gameboard.player1, gameboard.player2];
    let firstMover = players[Math.round(Math.random())];
    const p1Name = document.querySelector(".p1name");
    const p2Name = document.querySelector(".p2name");
    gameboard.player1.name = p1Name.value;
    gameboard.player2.name = p2Name.value;

    gameboard.resetBoard();
    gameboard.currentMover = firstMover;
    updateGameText();

    for (button of buttons)
    {
        button.addEventListener("click", playButton);
    }
}

playRound();