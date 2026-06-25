"use strict";

// CONSTANTES DEL JUEGO
const ROWS = 6;
const COLS = 7;
const CELL_SIZE = 80;
const PLAYER_PIECE = 1;
const BOT_PIECE = 2;
const RECORDS_KEY = "conecta4_records";

// Colores del juego
const BOARD_COLOR = "#2563eb";
const EMPTY_COLOR = "#f8fafc";
const PLAYER_COLOR = "#ef4444";
const BOT_COLOR = "#facc15";
const STROKE_COLOR = "#0f172a";

// Elementos del DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const homeScreen = document.getElementById("homeScreen");
const gameInfo = document.getElementById("gameInfo");
const canvasContainer = document.getElementById("canvasContainer");

const turnDisplay = document.getElementById("turnDisplay");
const moveCountDisplay = document.getElementById("moveCountDisplay");

const startBtn = document.getElementById("startBtn");
const helpBtn = document.getElementById("helpBtn");
const recordBtn = document.getElementById("recordBtn");

const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficultySelect");

const helpModal = document.getElementById("helpModal");
const recordModal = document.getElementById("recordModal");
const recordList = document.getElementById("recordList");

// Estado del juego
let board = [];
let gameRunning = false;
let turn = PLAYER_PIECE;
let moveCount = 0;
let playerName = "";
let difficulty = "medium";

// Inicializa el tablero
function initBoard() {
  board = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];

    for (let c = 0; c < COLS; c++) {
      row.push(0);
    }

    board.push(row);
  }
}

// Dibuja el tablero
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = BOARD_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const centerX = c * CELL_SIZE + CELL_SIZE / 2;
      const centerY = r * CELL_SIZE + CELL_SIZE / 2;
      const radius = CELL_SIZE / 2 - 7;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

      if (board[r][c] === PLAYER_PIECE) {
        ctx.fillStyle = PLAYER_COLOR;
      } else if (board[r][c] === BOT_PIECE) {
        ctx.fillStyle = BOT_COLOR;
      } else {
        ctx.fillStyle = EMPTY_COLOR;
      }

      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
      ctx.closePath();
    }
  }
}

// Devuelve la fila disponible más baja de una columna
function getNextOpenRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      return r;
    }
  }

  return -1;
}

// Inserta una ficha en el tablero
function dropPiece(row, col, piece) {
  board[row][col] = piece;
}

// Verifica si una ficha conectó 4
function checkWin(piece) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r][c + 1] === piece &&
        board[r][c + 2] === piece &&
        board[r][c + 3] === piece
      ) {
        return true;
      }
    }
  }

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c] === piece &&
        board[r + 2][c] === piece &&
        board[r + 3][c] === piece
      ) {
        return true;
      }
    }
  }

  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c + 1] === piece &&
        board[r + 2][c + 2] === piece &&
        board[r + 3][c + 3] === piece
      ) {
        return true;
      }
    }
  }

  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[r][c] === piece &&
        board[r - 1][c + 1] === piece &&
        board[r - 2][c + 2] === piece &&
        board[r - 3][c + 3] === piece
      ) {
        return true;
      }
    }
  }

  return false;
}

// Verifica si el tablero está lleno
function isBoardFull() {
  for (let c = 0; c < COLS; c++) {
    if (getNextOpenRow(c) !== -1) {
      return false;
    }
  }

  return true;
}

// Obtiene récords de localStorage
function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY)) || [];
  } catch (error) {
    console.error("Error al leer los récords:", error);
    localStorage.removeItem(RECORDS_KEY);
    return [];
  }
}

// Guarda un récord
function saveRecord(recordEntry) {
  const records = getRecords();
  records.push(recordEntry);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// Abre un modal
function openModal(modal) {
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("is-open");
  document.body.classList.add("overflow-hidden");
}

// Cierra un modal
function closeModal(modal) {
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("is-open");
  document.body.classList.remove("overflow-hidden");
}

// Actualiza el texto del turno
function updateTurnDisplay() {
  if (turn === PLAYER_PIECE) {
    turnDisplay.innerText = "Turno: " + playerName;
  } else {
    turnDisplay.innerText = "Turno: BOT";
  }
}

// Actualiza el contador de movimientos
function updateMoveCount() {
  moveCountDisplay.innerText = "Movimientos: " + moveCount;
}

// Movimiento del jugador
function handlePlayerMove(event) {
  if (!gameRunning || turn !== PLAYER_PIECE) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const clickX = (event.clientX - rect.left) * scaleX;
  const col = Math.floor(clickX / CELL_SIZE);

  if (col < 0 || col >= COLS) return;

  const row = getNextOpenRow(col);

  if (row === -1) return;

  dropPiece(row, col, PLAYER_PIECE);
  moveCount++;
  drawBoard();
  updateMoveCount();

  if (checkWin(PLAYER_PIECE)) {
    gameOver("GANASTE", playerName);
    return;
  }

  if (isBoardFull()) {
    gameOver("EMPATE", "Nadie");
    return;
  }

  turn = BOT_PIECE;
  updateTurnDisplay();

  setTimeout(botTurn, 500);
}

// Turno del bot
function botTurn() {
  if (!gameRunning) return;

  let col = getBotMove(board, difficulty);
  let row = getNextOpenRow(col);

  if (row === -1) {
    const validCols = [];

    for (let c = 0; c < COLS; c++) {
      if (getNextOpenRow(c) !== -1) {
        validCols.push(c);
      }
    }

    if (validCols.length === 0) {
      gameOver("EMPATE", "Nadie");
      return;
    }

    col = validCols[Math.floor(Math.random() * validCols.length)];
    row = getNextOpenRow(col);
  }

  dropPiece(row, col, BOT_PIECE);
  moveCount++;
  drawBoard();
  updateMoveCount();

  if (checkWin(BOT_PIECE)) {
    gameOver("PERDISTE", "BOT");
    return;
  }

  if (isBoardFull()) {
    gameOver("EMPATE", "Nadie");
    return;
  }

  turn = PLAYER_PIECE;
  updateTurnDisplay();
}

// Finaliza la partida
function gameOver(result, winner) {
  gameRunning = false;

  const recordEntry = {
    name: playerName,
    result: result,
    moves: moveCount,
    winner: winner,
    difficulty: difficulty,
    date: new Date().toLocaleString()
  };

  saveRecord(recordEntry);

  let message = "";

  if (result === "GANASTE") {
    message = "¡Felicidades " + playerName + "! Ganaste en " + moveCount + " movimientos.";
  } else if (result === "PERDISTE") {
    message = "Qué mal " + playerName + ", el BOT ganó en " + moveCount + " movimientos.";
  } else {
    message = "El juego terminó en empate después de " + moveCount + " movimientos.";
  }

  alert("¡Fin del juego! " + message);
  resetGame();
}

// Reinicia el juego
function resetGame() {
  initBoard();

  moveCount = 0;
  turn = PLAYER_PIECE;

  updateTurnDisplay();
  updateMoveCount();
  drawBoard();

  homeScreen.classList.remove("hidden");
  gameInfo.classList.add("hidden");
  canvasContainer.classList.add("hidden");
}

// Inicia la partida
function startGame() {
  playerName = playerNameInput.value.trim();
  difficulty = difficultySelect.value;

  if (playerName === "") {
    alert("Ingresa tu nombre para iniciar la partida.");
    return;
  }

  homeScreen.classList.add("hidden");
  gameInfo.classList.remove("hidden");
  canvasContainer.classList.remove("hidden");

  initBoard();

  moveCount = 0;
  turn = PLAYER_PIECE;
  gameRunning = true;

  updateTurnDisplay();
  updateMoveCount();
  drawBoard();
}

// Renderiza los récords
function loadRecords() {
  const records = getRecords();

  recordList.innerHTML = "";

  if (records.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "record-empty";
    emptyItem.innerText = "Todavía no hay récords guardados.";
    recordList.appendChild(emptyItem);
    return;
  }

  records.sort((a, b) => a.moves - b.moves);

  records.forEach((record, index) => {
    const item = document.createElement("li");
    item.className = "record-item";

    const title = document.createElement("div");
    title.className = "record-item-title";
    title.innerText = `${index + 1}. ${record.name} - ${record.result}`;

    const detail = document.createElement("div");
    detail.className = "record-item-detail";

    const difficultyText = record.difficulty ? ` - Dificultad: ${record.difficulty}` : "";

    detail.innerText = `Movimientos: ${record.moves} - Ganador: ${record.winner}${difficultyText} - ${record.date}`;

    item.appendChild(title);
    item.appendChild(detail);
    recordList.appendChild(item);
  });
}

// Muestra récords
function showRecords() {
  loadRecords();
  openModal(recordModal);
}

// Eventos
canvas.addEventListener("click", handlePlayerMove);

startBtn.addEventListener("click", startGame);

helpBtn.addEventListener("click", () => {
  openModal(helpModal);
});

recordBtn.addEventListener("click", showRecords);

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", () => {
    const modalId = element.getAttribute("data-close-modal");
    const modal = document.getElementById(modalId);
    closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(helpModal);
    closeModal(recordModal);
  }
});
