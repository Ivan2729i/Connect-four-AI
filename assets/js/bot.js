"use strict";

/*
  Bot de Conecta 4 con dificultad:
  - Fácil: gana, bloquea o juega aleatorio.
  - Medio: Minimax con profundidad media.
  - Extremo: Minimax más profundo con poda alfa-beta.
*/

(function () {
  const ROWS_BOT = 6;
  const COLS_BOT = 7;

  const EMPTY = 0;
  const PLAYER_PIECE_BOT = 1;
  const BOT_PIECE_BOT = 2;

  const MEDIUM_DEPTH = 4;
  const EXTREME_DEPTH = 7;

  // Ordena las columnas priorizando el centro.
  // En Conecta 4 el centro suele ser la zona más fuerte.
  const COLUMN_ORDER = [3, 2, 4, 1, 5, 0, 6];

  function copyBoard(board) {
    return board.map((row) => row.slice());
  }

  function getNextOpenRowBot(board, col) {
    for (let r = ROWS_BOT - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) {
        return r;
      }
    }

    return -1;
  }

  function getValidColumns(board) {
    return COLUMN_ORDER.filter((col) => getNextOpenRowBot(board, col) !== -1);
  }

  function dropPieceBot(board, row, col, piece) {
    board[row][col] = piece;
  }

  function checkWinBot(board, piece) {
    // Horizontal
    for (let r = 0; r < ROWS_BOT; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
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

    // Vertical
    for (let c = 0; c < COLS_BOT; c++) {
      for (let r = 0; r < ROWS_BOT - 3; r++) {
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

    // Diagonal positiva
    for (let r = 0; r < ROWS_BOT - 3; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
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

    // Diagonal negativa
    for (let r = 3; r < ROWS_BOT; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
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

  function isTerminalNode(board) {
    return (
      checkWinBot(board, PLAYER_PIECE_BOT) ||
      checkWinBot(board, BOT_PIECE_BOT) ||
      getValidColumns(board).length === 0
    );
  }

  function getRandomMove(board) {
    const validColumns = getValidColumns(board);

    if (validColumns.length === 0) {
      return -1;
    }

    return validColumns[Math.floor(Math.random() * validColumns.length)];
  }

  function findImmediateMove(board, piece) {
    const validColumns = getValidColumns(board);

    for (const col of validColumns) {
      const row = getNextOpenRowBot(board, col);
      const tempBoard = copyBoard(board);

      dropPieceBot(tempBoard, row, col, piece);

      if (checkWinBot(tempBoard, piece)) {
        return col;
      }
    }

    return null;
  }

  function evaluateWindow(windowArray, piece) {
    let score = 0;

    const opponentPiece =
      piece === BOT_PIECE_BOT ? PLAYER_PIECE_BOT : BOT_PIECE_BOT;

    const pieceCount = windowArray.filter((cell) => cell === piece).length;
    const opponentCount = windowArray.filter((cell) => cell === opponentPiece).length;
    const emptyCount = windowArray.filter((cell) => cell === EMPTY).length;

    if (pieceCount === 4) {
      score += 100000;
    } else if (pieceCount === 3 && emptyCount === 1) {
      score += 120;
    } else if (pieceCount === 2 && emptyCount === 2) {
      score += 15;
    }

    if (opponentCount === 4) {
      score -= 100000;
    } else if (opponentCount === 3 && emptyCount === 1) {
      score -= 140;
    } else if (opponentCount === 2 && emptyCount === 2) {
      score -= 20;
    }

    return score;
  }

  function scorePosition(board, piece) {
    let score = 0;

    // Prioridad al centro
    const centerCol = Math.floor(COLS_BOT / 2);
    const centerArray = [];

    for (let r = 0; r < ROWS_BOT; r++) {
      centerArray.push(board[r][centerCol]);
    }

    const centerCount = centerArray.filter((cell) => cell === piece).length;
    score += centerCount * 8;

    // Horizontal
    for (let r = 0; r < ROWS_BOT; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
        const windowArray = [
          board[r][c],
          board[r][c + 1],
          board[r][c + 2],
          board[r][c + 3]
        ];

        score += evaluateWindow(windowArray, piece);
      }
    }

    // Vertical
    for (let c = 0; c < COLS_BOT; c++) {
      for (let r = 0; r < ROWS_BOT - 3; r++) {
        const windowArray = [
          board[r][c],
          board[r + 1][c],
          board[r + 2][c],
          board[r + 3][c]
        ];

        score += evaluateWindow(windowArray, piece);
      }
    }

    // Diagonal positiva
    for (let r = 0; r < ROWS_BOT - 3; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
        const windowArray = [
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3]
        ];

        score += evaluateWindow(windowArray, piece);
      }
    }

    // Diagonal negativa
    for (let r = 3; r < ROWS_BOT; r++) {
      for (let c = 0; c < COLS_BOT - 3; c++) {
        const windowArray = [
          board[r][c],
          board[r - 1][c + 1],
          board[r - 2][c + 2],
          board[r - 3][c + 3]
        ];

        score += evaluateWindow(windowArray, piece);
      }
    }

    return score;
  }

  function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validColumns = getValidColumns(board);
    const terminal = isTerminalNode(board);

    if (depth === 0 || terminal) {
      if (terminal) {
        if (checkWinBot(board, BOT_PIECE_BOT)) {
          return {
            col: null,
            score: 100000000 + depth
          };
        }

        if (checkWinBot(board, PLAYER_PIECE_BOT)) {
          return {
            col: null,
            score: -100000000 - depth
          };
        }

        return {
          col: null,
          score: 0
        };
      }

      return {
        col: null,
        score: scorePosition(board, BOT_PIECE_BOT)
      };
    }

    if (maximizingPlayer) {
      let value = -Infinity;
      let bestCol = validColumns[0];

      for (const col of validColumns) {
        const row = getNextOpenRowBot(board, col);
        const tempBoard = copyBoard(board);

        dropPieceBot(tempBoard, row, col, BOT_PIECE_BOT);

        const newScore = minimax(
          tempBoard,
          depth - 1,
          alpha,
          beta,
          false
        ).score;

        if (newScore > value) {
          value = newScore;
          bestCol = col;
        }

        alpha = Math.max(alpha, value);

        if (alpha >= beta) {
          break;
        }
      }

      return {
        col: bestCol,
        score: value
      };
    }

    let value = Infinity;
    let bestCol = validColumns[0];

    for (const col of validColumns) {
      const row = getNextOpenRowBot(board, col);
      const tempBoard = copyBoard(board);

      dropPieceBot(tempBoard, row, col, PLAYER_PIECE_BOT);

      const newScore = minimax(
        tempBoard,
        depth - 1,
        alpha,
        beta,
        true
      ).score;

      if (newScore < value) {
        value = newScore;
        bestCol = col;
      }

      beta = Math.min(beta, value);

      if (alpha >= beta) {
        break;
      }
    }

    return {
      col: bestCol,
      score: value
    };
  }

  function getEasyMove(board) {
    const botWinMove = findImmediateMove(board, BOT_PIECE_BOT);

    if (botWinMove !== null) {
      return botWinMove;
    }

    const blockPlayerMove = findImmediateMove(board, PLAYER_PIECE_BOT);

    if (blockPlayerMove !== null) {
      return blockPlayerMove;
    }

    return getRandomMove(board);
  }

  function getMediumMove(board) {
    const botWinMove = findImmediateMove(board, BOT_PIECE_BOT);

    if (botWinMove !== null) {
      return botWinMove;
    }

    const blockPlayerMove = findImmediateMove(board, PLAYER_PIECE_BOT);

    if (blockPlayerMove !== null) {
      return blockPlayerMove;
    }

    const result = minimax(board, MEDIUM_DEPTH, -Infinity, Infinity, true);

    if (result.col === null || result.col === undefined) {
      return getRandomMove(board);
    }

    return result.col;
  }

  function getExtremeMove(board) {
    const botWinMove = findImmediateMove(board, BOT_PIECE_BOT);

    if (botWinMove !== null) {
      return botWinMove;
    }

    const blockPlayerMove = findImmediateMove(board, PLAYER_PIECE_BOT);

    if (blockPlayerMove !== null) {
      return blockPlayerMove;
    }

    const result = minimax(board, EXTREME_DEPTH, -Infinity, Infinity, true);

    if (result.col === null || result.col === undefined) {
      return getRandomMove(board);
    }

    return result.col;
  }

  window.getBotMove = function (board, difficulty) {
    if (difficulty === "easy" || difficulty === "facil") {
      return getEasyMove(board);
    }

    if (difficulty === "medium" || difficulty === "medio") {
      return getMediumMove(board);
    }

    if (difficulty === "extreme" || difficulty === "extremo") {
      return getExtremeMove(board);
    }

    return getEasyMove(board);
  };
})();
