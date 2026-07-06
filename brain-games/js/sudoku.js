/* =========================================================================
   SUDOKU — pure client-side generator, validator, and solver
   No API needed: a fresh backtracking-generated puzzle every game.
========================================================================= */

const Sudoku = (function () {
  let el = null;
  let solution = [];
  let puzzle = []; // 0 = blank
  let given = []; // boolean mask of clue cells
  let timerId = null;
  let seconds = 0;

  const DIFFICULTY = { easy: 42, medium: 32, hard: 26 };

  function emptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isValidPlacement(board, r, c, val) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === val) return false;
      if (board[i][c] === val) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = br; i < br + 3; i++)
      for (let j = bc; j < bc + 3; j++) if (board[i][j] === val) return false;
    return true;
  }

  function fillBoard(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          for (const val of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
            if (isValidPlacement(board, r, c, val)) {
              board[r][c] = val;
              if (fillBoard(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function generate(clueCount) {
    const board = emptyBoard();
    fillBoard(board);
    solution = board.map((row) => row.slice());
    puzzle = board.map((row) => row.slice());

    const cells = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c]);
    const toRemove = 81 - clueCount;
    const order = shuffled(cells);
    for (let i = 0; i < toRemove && i < order.length; i++) {
      const [r, c] = order[i];
      puzzle[r][c] = 0;
    }
    given = puzzle.map((row) => row.map((v) => v !== 0));
  }

  function mount(container) {
    el = container;
    renderSetup();
  }

  function renderSetup() {
    el.innerHTML = `
      <h2>🔢 Sudoku</h2>
      <p class="game-sub">A fresh, uniquely generated puzzle every time via backtracking — fill every row, column, and 3×3 box with 1–9.</p>
      <div class="row">
        <select id="sudokuDiff" class="select">
          <option value="easy">Easy</option>
          <option value="medium" selected>Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button class="btn" id="sudokuStart">New Puzzle</button>
      </div>
      <div id="sudokuBody"></div>
    `;
    document.getElementById("sudokuStart").addEventListener("click", startGame);
    startGame();
  }

  function startGame() {
    const diffSel = document.getElementById("sudokuDiff");
    const clues = DIFFICULTY[diffSel ? diffSel.value : "medium"];
    generate(clues);
    seconds = 0;
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      seconds++;
      const t = document.getElementById("sudokuTimer");
      if (t) t.textContent = formatTime(seconds);
    }, 1000);
    renderBoard();
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function renderBoard() {
    const body = document.getElementById("sudokuBody");
    let gridHtml = "";
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const classes = ["sudoku-cell"];
        if (given[r][c]) classes.push("given");
        if (c === 2 || c === 5) classes.push("border-right");
        if (r === 2 || r === 5) classes.push("border-bottom");
        const val = puzzle[r][c];
        if (given[r][c]) {
          gridHtml += `<div class="${classes.join(" ")}" data-r="${r}" data-c="${c}">${val}</div>`;
        } else {
          gridHtml += `<div class="${classes.join(" ")}" data-r="${r}" data-c="${c}"><input maxlength="1" inputmode="numeric" data-r="${r}" data-c="${c}" value="${val || ""}" /></div>`;
        }
      }
    }
    body.innerHTML = `
      <div class="sudoku-wrap">
        <div class="row">
          <span>⏱ <span id="sudokuTimer">${formatTime(seconds)}</span></span>
        </div>
        <div id="sudokuStatus" class="sudoku-status"></div>
        <div class="sudoku-grid">${gridHtml}</div>
        <div class="row">
          <button class="btn" id="sudokuCheck">Check Solution</button>
          <button class="btn secondary" id="sudokuReveal">Reveal Solution</button>
        </div>
      </div>
    `;
    body.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const v = e.target.value.replace(/[^1-9]/g, "").slice(0, 1);
        e.target.value = v;
        const r = parseInt(input.dataset.r, 10);
        const c = parseInt(input.dataset.c, 10);
        puzzle[r][c] = v ? parseInt(v, 10) : 0;
      });
    });
    document.getElementById("sudokuCheck").addEventListener("click", checkSolution);
    document.getElementById("sudokuReveal").addEventListener("click", revealSolution);
  }

  function checkSolution() {
    const statusEl = document.getElementById("sudokuStatus");
    let complete = true;
    let correct = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!puzzle[r][c]) complete = false;
        else if (puzzle[r][c] !== solution[r][c]) correct = false;
      }
    }
    if (!complete) {
      statusEl.textContent = "Keep going — the grid isn't full yet.";
      statusEl.className = "sudoku-status bad";
    } else if (correct) {
      clearInterval(timerId);
      statusEl.textContent = `Solved in ${formatTime(seconds)}! 🎉`;
      statusEl.className = "sudoku-status ok";
    } else {
      statusEl.textContent = "Full, but a few numbers don't fit yet — check for repeats in each row, column, or box.";
      statusEl.className = "sudoku-status bad";
    }
  }

  function revealSolution() {
    puzzle = solution.map((row) => row.slice());
    given = puzzle.map((row) => row.map(() => true));
    clearInterval(timerId);
    renderBoard();
    const statusEl = document.getElementById("sudokuStatus");
    if (statusEl) {
      statusEl.textContent = "Solution revealed.";
      statusEl.className = "sudoku-status";
    }
  }

  return { mount };
})();
