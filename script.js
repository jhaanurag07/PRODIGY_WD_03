
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const gameMode = document.getElementById("gameMode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const index = Number(event.target.dataset.index);

    if (!gameActive || board[index] !== "") {
        return;
    }

    makeMove(index, currentPlayer);

    if (gameActive && gameMode.value === "computer"
        && currentPlayer === "O") {
        setTimeout(computerMove, 350);
    }
}

function makeMove(index, player) {
    if (!gameActive || board[index] !== "") {
        return;
    }

    board[index] = player;
    cells[index].textContent = player;
    cells[index].disabled = true;

    if (checkWinner()) {
        statusText.textContent = `Player ${player} Wins! 🎉`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = player === "X" ? "O" : "X";

    if (gameMode.value === "computer"
        && currentPlayer === "O") {
        statusText.textContent = "Computer's Turn 🤖";
    } else {
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;

        return board[a] !== ""
            && board[a] === board[b]
            && board[b] === board[c];
    });
}

function computerMove() {
    if (!gameActive || gameMode.value !== "computer") {
        return;
    }

    const emptyCells = board
        .map((value, index) => value === "" ? index : -1)
        .filter(index => index !== -1);

    if (emptyCells.length === 0) {
        return;
    }

    // Take a winning move if one is available.
    let chosenMove = findWinningMove("O");

    // Otherwise, block the player's winning move.
    if (chosenMove === -1) {
        chosenMove = findWinningMove("X");
    }

    // Prefer the center, then a corner, then any empty cell.
    if (chosenMove === -1 && board[4] === "") {
        chosenMove = 4;
    }

    if (chosenMove === -1) {
        const corners = [0, 2, 6, 8].filter(
            index => board[index] === ""
        );

        if (corners.length > 0) {
            chosenMove = corners[
                Math.floor(Math.random() * corners.length)
            ];
        }
    }

    if (chosenMove === -1) {
        chosenMove = emptyCells[
            Math.floor(Math.random() * emptyCells.length)
        ];
    }

    makeMove(chosenMove, "O");
}

function findWinningMove(player) {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const indexes = [a, b, c];

        const playerCount = indexes.filter(
            index => board[index] === player
        ).length;

        const emptyIndexes = indexes.filter(
            index => board[index] === ""
        );

        if (playerCount === 2 && emptyIndexes.length === 1) {
            return emptyIndexes[0];
        }
    }

    return -1;
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
    });

    statusText.textContent = "Player X's Turn";
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);
gameMode.addEventListener("change", restartGame);
