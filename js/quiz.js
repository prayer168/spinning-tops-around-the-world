(() => {
  const card = document.querySelector("#quiz-card");
  const next = document.querySelector("#quiz-next");
  const restart = document.querySelector("#quiz-restart");
  const counter = document.querySelector("#quiz-counter");
  const scoreLabel = document.querySelector("#quiz-score");
  const bar = document.querySelector("#quiz-progress");
  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;

  function render() {
    const item = questions[index];
    answered = false;
    next.disabled = true;
    counter.textContent = `第 ${index + 1}／${questions.length} 題`;
    scoreLabel.textContent = `${score} 分`;
    bar.style.width = `${((index + 1) / questions.length) * 100}%`;
    card.innerHTML = `
      <p class="quiz-type">${item.type}</p>
      <h3>${item.question}</h3>
      <div class="quiz-options">${item.options.map((option, optionIndex) => `<button type="button" data-option="${optionIndex}">${String.fromCharCode(65 + optionIndex)}　${option}</button>`).join("")}</div>
      <div id="quiz-explanation"></div>`;
  }

  function choose(option) {
    if (answered) return;
    answered = true;
    const item = questions[index];
    const correct = option === item.answer;
    if (correct) score += 10;
    card.querySelectorAll("[data-option]").forEach(button => {
      const value = Number(button.dataset.option);
      button.disabled = true;
      if (value === item.answer) button.classList.add("correct");
      if (value === option && !correct) button.classList.add("wrong");
    });
    card.querySelector("#quiz-explanation").innerHTML = `<div class="quiz-explanation"><strong>${correct ? "答對了" : "再想一步"}</strong><br>${item.explanation}<br><a href="#${item.reviewTab}" data-open-tab="${item.reviewTab}">回看對應教材 →</a></div>`;
    scoreLabel.textContent = `${score} 分`;
    next.disabled = false;
    next.focus();
  }

  function finish() {
    const total = questions.length * 10;
    const message = score >= 70 ? "你已能用證據連結科學、文化與安全。" : score >= 50 ? "基礎概念已到位，回看解析後再挑戰一次。" : "先回到旋轉科學與操作安全，找出圖中的位置、方向和證據。";
    counter.textContent = "挑戰完成";
    bar.style.width = "100%";
    card.classList.add("quiz-result");
    card.innerHTML = `<div><p class="quiz-type">YOUR RESULT</p><strong>${score}／${total}</strong><h3>${message}</h3></div>`;
    next.hidden = true;
    restart.hidden = false;
    document.dispatchEvent(new CustomEvent("quizcomplete", { detail: { score, total } }));
  }

  card.addEventListener("click", event => {
    const button = event.target.closest("[data-option]");
    if (button) choose(Number(button.dataset.option));
  });
  next.addEventListener("click", () => {
    if (!answered) return;
    if (index < questions.length - 1) { index += 1; render(); } else finish();
  });
  restart.addEventListener("click", () => {
    index = 0; score = 0; next.hidden = false; restart.hidden = true; card.classList.remove("quiz-result"); render();
  });

  fetch("data/quiz.json").then(response => response.json()).then(data => {
    questions = data;
    render();
  }).catch(error => {
    console.error(error);
    card.innerHTML = `<p role="alert">題庫暫時無法載入，請使用本機伺服器或重新整理頁面。</p>`;
  });
})();

