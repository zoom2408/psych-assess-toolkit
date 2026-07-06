/* =========================================================================
   2048 — pure client-side sliding block puzzle
   No API needed: classic merge-the-tiles game with arrow keys or swipe.
========================================================================= */

const Game2048 = (function () {
  const SIZE = 4;
  let el = null;
  let grid = [];
  let score = 0;
  let best = parseInt(localStorage.getItem("brainGames.2048.best") || "0", 10);
  let over = false;
  let won = false;
  let keyHandler = null;
  let touchStartX = 0;
  let touchStartY = 0;

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function emptyCells() {
    const cells = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) cells.push([r, c]);
    return cells;
  }

  function addRandomTile() {
    const cells = emptyCells();
    if (!cells.length) return;
    const [r, c] = cells[Math.floor(Math.random() * cells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function mount(container) {
    el = container;
    startGame();
  }

  function startGame() {
    grid = emptyGrid();
    score = 0;
    over = false;
    won = false;
    addRandomTile();
    addRandomTile();
    render();
    attachKeys();
  }

  function attachKeys() {
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = (e) => {
      if (!el || !document.body.contains(el)) return;
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    document.addEventListener("keydown", keyHandler);
  }

  function slideRowLeft(row) {
    const vals = row.filter((v) => v !== 0);
    const merged = [];
    let gained = 0;
    for (let i = 0; i < vals.length; i++) {
      if (i < vals.length - 1 && vals[i] === vals[i + 1]) {
        const mergedVal = vals[i] * 2;
        merged.push(mergedVal);
        gained += mergedVal;
        if (mergedVal === 2048) won = true;
        i++;
      } else {
        merged.push(vals[i]);
      }
    }
    while (merged.length < SIZE) merged.push(0);
    return { row: merged, gained };
  }

  function rotateGridCW(g) {
    const n = g.length;
    const res = emptyGrid();
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) res[c][n - 1 - r] = g[r][c];
    return res;
  }

  function move(direction) {
    if (over) return;
    let rotations = 0;
    if (direction === "up") rotations = 3;
    else if (direction === "right") rotations = 2;
    else if (direction === "down") rotations = 1;
    else rotations = 0; // left

    let working = grid;
    for (let i = 0; i < rotations; i++) working = rotateGridCW(working);

    let moved = false;
    let gainedTotal = 0;
    const result = working.map((row) => {
      const before = row.join(",");
      const { row: newRow, gained } = slideRowLeft(row);
      gainedTotal += gained;
      if (newRow.join(",") !== before) moved = true;
      return newRow;
    });

    let restored = result;
    const restoreRotations = (4 - rotations) % 4;
    for (let i = 0; i < restoreRotations; i++) restored = rotateGridCW(restored);

    if (!moved) return;
    grid = restored;
    score += gainedTotal;
    if (score > best) {
      best = score;
      localStorage.setItem("brainGames.2048.best", String(best));
    }
    addRandomTile();
    if (!emptyCells().length && !hasMoves()) over = true;
    render();
  }

  function hasMoves() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = grid[r][c];
        if (c < SIZE - 1 && grid[r][c + 1] === v) return true;
        if (r < SIZE - 1 && grid[r + 1][c] === v) return true;
      }
    }
    return false;
  }

  function render() {
    let cellsHtml = "";
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) cellsHtml += `<div class="p2048-cell"></div>`;

    let tilesHtml = "";
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = grid[r][c];
        if (v) {
          tilesHtml += `<div class="p2048-tile" data-v="${v}" style="grid-row:${r + 1};grid-column:${c + 1};">${v}</div>`;
        }
      }
    }

    let banner = "";
    if (won) banner = `<div class="game-error" style="background:#ecfdf5;border-color:#a7f3d0;color:#16a34a;">You reached 2048! Keep going for a higher score, or start a new game.</div>`;
    else if (over) banner = `<div class="game-error">No more moves — game over.</div>`;

    el.innerHTML = `
      <h2>🎮 2048</h2>
      <p class="game-sub">Slide tiles with the arrow keys (or swipe on mobile) to combine matching numbers. Reach 2048 to win.</p>
      <div class="row">
        <span>Score: <strong>${score}</strong></span>
        <span>Best: <strong>${best}</strong></span>
        <button class="btn secondary small" id="p2048New">New Game</button>
      </div>
      ${banner}
      <p class="p2048-hint">Tip: click the board once, then use your arrow keys.</p>
      <div class="puzzle2048-wrap">
        <div class="puzzle2048-grid" id="p2048Grid" tabindex="0" style="display:grid;">
          ${cellsHtml}
          ${tilesHtml}
        </div>
      </div>
    `;
    document.getElementById("p2048New").addEventListener("click", startGame);
    const gridEl = document.getElementById("p2048Grid");
    gridEl.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });
    gridEl.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    });
    gridEl.focus();
  }

  return { mount };
})();
