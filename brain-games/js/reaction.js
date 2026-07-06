/* =========================================================================
   REACTION TIME TEST — pure client-side cognitive mini-game
   No API needed: measures how fast you react to a visual "go" signal
   across 5 rounds and compares to the typical human average (~250ms).
========================================================================= */

const Reaction = (function () {
  let el = null;
  let state = "idle"; // idle | waiting | go | early | done
  let timeoutId = null;
  let startTime = 0;
  let results = [];
  const ROUNDS = 5;

  function mount(container) {
    el = container;
    results = [];
    render();
  }

  function render() {
    el.innerHTML = `
      <h2>⚡ Reaction Time Test</h2>
      <p class="game-sub">Click the box, wait for it to turn green, then click as fast as you can. ${ROUNDS} rounds — average human visual reaction time is around 200–300ms.</p>
      <div class="reaction-box idle" id="reactBox">Click to start round ${results.length + 1} of ${ROUNDS}</div>
      <div class="reaction-stats" id="reactStats"></div>
    `;
    renderStats();
    document.getElementById("reactBox").addEventListener("click", onBoxClick);
    state = "idle";
  }

  function renderStats() {
    const statsEl = document.getElementById("reactStats");
    if (!statsEl) return;
    if (!results.length) {
      statsEl.innerHTML = "";
      return;
    }
    const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
    const best = Math.min(...results);
    statsEl.innerHTML = `
      <div class="reaction-stat"><div class="val">${results.length}/${ROUNDS}</div><div class="lbl">Rounds</div></div>
      <div class="reaction-stat"><div class="val">${best}ms</div><div class="lbl">Best</div></div>
      <div class="reaction-stat"><div class="val">${avg}ms</div><div class="lbl">Average</div></div>
    `;
  }

  function onBoxClick() {
    const box = document.getElementById("reactBox");
    if (results.length >= ROUNDS) {
      results = [];
      render();
      return;
    }

    if (state === "idle" || state === "early") {
      state = "waiting";
      box.className = "reaction-box waiting";
      box.textContent = "Wait for green…";
      const delay = 1200 + Math.random() * 2800;
      timeoutId = setTimeout(() => {
        state = "go";
        startTime = performance.now();
        box.className = "reaction-box go";
        box.textContent = "CLICK NOW!";
      }, delay);
    } else if (state === "waiting") {
      clearTimeout(timeoutId);
      state = "early";
      box.className = "reaction-box early";
      box.textContent = "Too soon! Click to try this round again.";
    } else if (state === "go") {
      const elapsed = Math.round(performance.now() - startTime);
      results.push(elapsed);
      state = "idle";
      renderStats();
      if (results.length >= ROUNDS) {
        const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
        box.className = "reaction-box idle";
        box.textContent = `Done! Average: ${avg}ms — click to play again`;
      } else {
        box.className = "reaction-box idle";
        box.textContent = `${elapsed}ms — click for round ${results.length + 1} of ${ROUNDS}`;
      }
    }
  }

  return { mount };
})();
