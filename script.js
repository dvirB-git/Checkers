const boardData = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];
const boardElement = document.getElementById("board");
let currentPlayer = 1;
let selectedRow = 0;
let selectedCol = 0;

function createBoard() {
  let isLight = true;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.id = "cell-" + row + "-" + col;

      if (isLight) square.classList.add("light");
      else square.classList.add("dark");
      square.addEventListener("click", function () {
        squareClicked(this.id);
      });
      boardElement.appendChild(square);
      isLight = !isLight;
    }
    isLight = !isLight;
  }
}

function updatePieces() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let square = document.getElementById("cell-" + row + "-" + col);
      square.innerHTML = "";

      let value = boardData[row][col];
      if (value !== 0) {
        let piece = document.createElement("div");
        piece.classList.add("piece");
        if (value === 1) piece.classList.add("player1");
        if (value === 2) piece.classList.add("player2");
        if (value === 3) {
          piece.classList.add("player1", "king");
        }
        if (value === 4) {
          piece.classList.add("player2", "king");
        }
        square.appendChild(piece);
      }
    }
  }
}

function squareClicked(clickedId) {
  let parts = clickedId.split("-");
  let row = parseInt(parts[1]);
  let col = parseInt(parts[2]);
  let targetSquare = document.getElementById(clickedId);
  let clickedValue = boardData[row][col];

  if (
    (currentPlayer === 1 && (clickedValue === 1 || clickedValue === 3)) ||
    (currentPlayer === 2 && (clickedValue === 2 || clickedValue === 4))
  ) {
    showPossibleMoves(row, col);
  } else if (
    clickedValue === 0 &&
    (targetSquare.style.backgroundColor === "yellow" ||
      targetSquare.classList.contains("highlighted"))
  ) {
    movePiece(row, col);
  }
}

function clearHighlights() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.getElementById("cell-" + i + "-" + j);
      square.style.backgroundColor = "";
      square.classList.remove("highlighted");
    }
  }
}

function highlightSquare(targetId) {
  let square = document.getElementById(targetId);
  square.style.backgroundColor = "yellow";
  square.classList.add("highlighted");
}

function showPossibleMoves(row, col) {
  clearHighlights();
  selectedCol = col;
  selectedRow = row;

  let pieceValue = boardData[row][col];
  let isKing = pieceValue === 3 || pieceValue === 4;

  let directions =
    currentPlayer === 1 ? (isKing ? [-1, 1] : [-1]) : isKing ? [1, -1] : [1];

  let enemy = currentPlayer === 1 ? 2 : 1;
  let enemyKing = currentPlayer === 1 ? 4 : 3;

  for (let dir of directions) {
    if (row + dir >= 0 && row + dir < 8 && col - 1 >= 0) {
      let leftValue = boardData[row + dir][col - 1];
      if (leftValue === 0) {
        highlightSquare("cell-" + (row + dir) + "-" + (col - 1));
      } else if (leftValue === enemy || leftValue === enemyKing) {
        if (
          row + dir * 2 >= 0 &&
          row + dir * 2 < 8 &&
          col - 2 >= 0 &&
          boardData[row + dir * 2][col - 2] === 0
        ) {
          highlightSquare("cell-" + (row + dir * 2) + "-" + (col - 2));
        }
      }
    }

    if (row + dir >= 0 && row + dir < 8 && col + 1 < 8) {
      let rightValue = boardData[row + dir][col + 1];
      if (rightValue === 0) {
        highlightSquare("cell-" + (row + dir) + "-" + (col + 1));
      } else if (rightValue === enemy || rightValue === enemyKing) {
        if (
          row + dir * 2 >= 0 &&
          row + dir * 2 < 8 &&
          col + 2 < 8 &&
          boardData[row + dir * 2][col + 2] === 0
        ) {
          highlightSquare("cell-" + (row + dir * 2) + "-" + (col + 2));
        }
      }
    }
  }
}
function movePiece(targetRow, targetCol) {
  let movingPiece = boardData[selectedRow][selectedCol];

  if (Math.abs(targetRow - selectedRow) === 2) {
    let eatenRow = (selectedRow + targetRow) / 2;
    let eatenCol = (selectedCol + targetCol) / 2;
    boardData[eatenRow][eatenCol] = 0;
  }

  boardData[targetRow][targetCol] = movingPiece;
  boardData[selectedRow][selectedCol] = 0;

  checkKing(targetRow, targetCol);

  currentPlayer = currentPlayer === 1 ? 2 : 1;

  clearHighlights();
  updatePieces();
  checkWin();
}

function checkKing(targetRow, targetCol) {
  let pieceValue = boardData[targetRow][targetCol];

  if (pieceValue === 1 && targetRow === 0) {
    boardData[targetRow][targetCol] = 3;
  }
  if (pieceValue === 2 && targetRow === 7) {
    boardData[targetRow][targetCol] = 4;
  }
}
function checkWin() {
  let p1Exists = false;
  let p2Exists = false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let piece = boardData[r][c];
      if (piece === 1 || piece === 3) p1Exists = true;
      if (piece === 2 || piece === 4) p2Exists = true;
    }
  }

  if (!p1Exists) alert("שחקן 2 ניצח! כל הכבוד!");
  if (!p2Exists) alert("שחקן 1 ניצח! כל הכבוד!");
}

createBoard();
updatePieces();
