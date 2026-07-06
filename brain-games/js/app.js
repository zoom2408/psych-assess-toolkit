/* =========================================================================
   BRAIN GAMES — tab controller
   Mounts the active game module into #gamePanel and remembers the last
   tab the visitor had open (localStorage), same pattern as the rest of
   the hub's autosave conventions.
========================================================================= */

const TABS = [
  { key: "trivia", label: "Trivia", emoji: "🧩", module: () => Trivia },
  { key: "reaction", label: "Reaction", emoji: "⚡", module: () => Reaction },
  { key: "sudoku", label: "Sudoku", emoji: "🔢", module: () => Sudoku },
  { key: "2048", label: "2048", emoji: "🎮", module: () => Game2048 },
];

const STORAGE_KEY = "brainGames.lastTab";

function renderTabs(activeKey) {
  const bar = document.getElementById("tabBar");
  bar.innerHTML = TABS.map(
    (t) => `
    <button class="tab-btn ${t.key === activeKey ? "active" : ""}" data-key="${t.key}">
      <span class="tab-emoji">${t.emoji}</span>${t.label}
    </button>`
  ).join("");
  bar.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.key));
  });
}

function activateTab(key) {
  localStorage.setItem(STORAGE_KEY, key);
  renderTabs(key);
  const panel = document.getElementById("gamePanel");
  const tab = TABS.find((t) => t.key === key);
  if (tab) tab.module().mount(panel);
}

(function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const startKey = TABS.some((t) => t.key === saved) ? saved : "trivia";
  activateTab(startKey);
})();
