/* =========================================================================
   TRIVIA CHALLENGE — powered by the free Open Trivia Database API
   https://opentdb.com/api_config.php  (no key/auth required)
========================================================================= */

const Trivia = (function () {
  const CATEGORIES = [
    { id: "", name: "Any Category" },
    { id: "9", name: "General Knowledge" },
    { id: "17", name: "Science & Nature" },
    { id: "18", name: "Science: Computers" },
    { id: "22", name: "Geography" },
    { id: "23", name: "History" },
    { id: "24", name: "Politics" },
    { id: "25", name: "Art" },
    { id: "27", name: "Animals" },
    { id: "31", name: "Anime & Manga" },
  ];

  let el = null;
  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;

  function decodeHtml(str) {
    const ta = document.createElement("textarea");
    ta.innerHTML = str;
    return ta.value;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function mount(container) {
    el = container;
    renderSetup();
  }

  function renderSetup() {
    el.innerHTML = `
      <h2>🧩 Trivia Challenge</h2>
      <p class="game-sub">10 questions pulled live from the Open Trivia Database — a free, public trivia API. Pick a category and difficulty, or leave it random.</p>
      <div class="row">
        <select id="trivCategory" class="select">
          ${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
        </select>
        <select id="trivDifficulty" class="select">
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button class="btn" id="trivStart">Start Quiz</button>
      </div>
      <div id="trivBody"></div>
    `;
    document.getElementById("trivStart").addEventListener("click", startQuiz);
  }

  async function startQuiz() {
    const category = document.getElementById("trivCategory").value;
    const difficulty = document.getElementById("trivDifficulty").value;
    const body = document.getElementById("trivBody");
    body.innerHTML = `<p>Loading questions…</p>`;

    const params = new URLSearchParams({ amount: "10", type: "multiple" });
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);

    try {
      const res = await fetch(`https://opentdb.com/api.php?${params.toString()}`);
      const data = await res.json();
      if (data.response_code !== 0 || !data.results || !data.results.length) {
        body.innerHTML = `<div class="game-error">Couldn't find enough questions for that combination — try a different category or difficulty.</div>`;
        return;
      }
      questions = data.results.map((q) => {
        const options = shuffle([...q.incorrect_answers, q.correct_answer]).map(decodeHtml);
        return {
          question: decodeHtml(q.question),
          category: decodeHtml(q.category),
          difficulty: q.difficulty,
          correct: decodeHtml(q.correct_answer),
          options,
        };
      });
      index = 0;
      score = 0;
      renderQuestion();
    } catch (e) {
      body.innerHTML = `<div class="game-error">Couldn't reach the trivia API right now. Check your connection and try again.</div>`;
    }
  }

  function renderQuestion() {
    const body = document.getElementById("trivBody");
    const q = questions[index];
    answered = false;
    body.innerHTML = `
      <div class="trivia-progress">Question ${index + 1} of ${questions.length} · ${q.category} · ${q.difficulty} · Score: <span class="trivia-score">${score}</span></div>
      <p class="trivia-question">${q.question}</p>
      <div class="trivia-options">
        ${q.options.map((opt, i) => `<button class="trivia-option" data-i="${i}">${opt}</button>`).join("")}
      </div>
    `;
    body.querySelectorAll(".trivia-option").forEach((btn) => {
      btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.i, 10)));
    });
  }

  function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const q = questions[index];
    const buttons = document.querySelectorAll(".trivia-option");
    buttons.forEach((btn, bi) => {
      btn.disabled = true;
      if (btn.textContent === q.correct) btn.classList.add("correct");
      else if (bi === i) btn.classList.add("incorrect");
    });
    if (q.options[i] === q.correct) score++;

    setTimeout(() => {
      index++;
      if (index < questions.length) renderQuestion();
      else renderResult();
    }, 1000);
  }

  function renderResult() {
    const body = document.getElementById("trivBody");
    const pct = Math.round((score / questions.length) * 100);
    let msg = "Nice effort — every round sharpens recall.";
    if (pct === 100) msg = "Perfect score! Certified trivia machine. 🏆";
    else if (pct >= 70) msg = "Great job — that's a strong quiz brain. 🔥";
    else if (pct >= 40) msg = "Solid attempt — try a different category next round.";

    body.innerHTML = `
      <div class="trivia-result">
        <p>You scored</p>
        <div class="big-score">${score} / ${questions.length}</div>
        <p>${msg}</p>
        <button class="btn" id="trivAgain">Play Again</button>
      </div>
    `;
    document.getElementById("trivAgain").addEventListener("click", renderSetup);
  }

  return { mount };
})();
