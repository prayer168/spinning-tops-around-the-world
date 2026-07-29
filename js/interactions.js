(() => {
  const stage = document.querySelector("#sim-stage");
  const speed = document.querySelector("#speed-control");
  const friction = document.querySelector("#friction-control");
  const center = document.querySelector("#center-control");
  const speedOutput = document.querySelector("#speed-output");
  const frictionOutput = document.querySelector("#friction-output");
  const centerOutput = document.querySelector("#center-output");
  const status = document.querySelector("#sim-status");
  const evidence = document.querySelector("#sim-evidence");
  const playback = document.querySelector("#animation-speed");
  let running = false;
  let frame = 0;
  let lastTime = 0;
  let initialSpeed = Number(speed.value);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function describe() {
    const s = Number(speed.value);
    const f = Number(friction.value);
    const c = Number(center.value);
    const score = clamp(Math.round(s * .58 + (100 - f) * .24 + (100 - c) * .18), 0, 100);
    const tilt = clamp(Math.round((100 - s) * .15 + f * .045 + c * .035), 3, 34);
    const spinDuration = clamp(18 / Math.max(s, 1), .16, .9);
    const precessionDuration = clamp((s / 24) - (f / 90), 1.15, 4.2);
    stage.style.setProperty("--tilt", `${tilt}deg`);
    stage.style.setProperty("--spin-duration", `${spinDuration}s`);
    stage.style.setProperty("--precession-duration", `${precessionDuration}s`);
    speedOutput.value = Math.round(s);
    frictionOutput.value = Math.round(f);
    centerOutput.value = Math.round(c);
    const level = score >= 68 ? "較穩定" : score >= 43 ? "開始明顯晃動" : "容易傾倒";
    status.textContent = `${level}｜穩定指標 ${score}／100｜軸線傾斜約 ${tilt}°`;
    evidence.innerHTML = `<strong>觀察證據：</strong>目前轉速 ${Math.round(s)}、摩擦 ${f}、重心高度 ${c}。${score >= 68 ? "角動量較大且能量損失較慢。" : "阻力、低轉速或較高重心讓晃動更明顯。"}`;
  }

  function tick(time) {
    if (!running) return;
    const delta = lastTime ? (time - lastTime) / 1000 : 0;
    lastTime = time;
    const loss = (Number(friction.value) / 38) * Number(playback.value) * delta;
    speed.value = String(Math.max(20, Number(speed.value) - loss));
    describe();
    if (Number(speed.value) <= 20.1) {
      running = false;
      stage.classList.remove("is-playing");
      stage.style.setProperty("--tilt", "42deg");
      status.textContent = "轉速過低：模型中的陀螺倒下了。按重播再觀察一次。";
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function play() {
    if (running) return;
    running = true;
    lastTime = 0;
    stage.classList.add("is-playing");
    stage.classList.remove("is-paused");
    frame = requestAnimationFrame(tick);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(frame);
    stage.classList.add("is-paused");
    status.textContent = `已暫停｜轉速 ${Math.round(Number(speed.value))}。可調整變因後繼續。`;
  }

  function replay() {
    running = false;
    cancelAnimationFrame(frame);
    speed.value = String(initialSpeed);
    stage.classList.remove("is-paused");
    describe();
    play();
  }

  function reset() {
    running = false;
    cancelAnimationFrame(frame);
    speed.value = "80";
    friction.value = "25";
    center.value = "35";
    playback.value = "1";
    initialSpeed = 80;
    stage.classList.remove("is-playing", "is-paused");
    describe();
    status.textContent = "準備完成：調整滑桿後按播放。";
  }

  [speed, friction, center].forEach(control => control.addEventListener("input", () => {
    if (control === speed && !running) initialSpeed = Number(speed.value);
    describe();
  }));
  document.querySelector("#sim-play").addEventListener("click", play);
  document.querySelector("#sim-pause").addEventListener("click", pause);
  document.querySelector("#sim-replay").addEventListener("click", replay);
  document.querySelector("#sim-reset").addEventListener("click", reset);
  describe();

  const correct = ["清空投擲區", "檢查器材", "纏繩", "握持", "投擲並抽繩", "停穩後回收"];
  const shuffled = ["握持", "停穩後回收", "纏繩", "投擲並抽繩", "清空投擲區", "檢查器材"];
  const bank = document.querySelector("#sequence-bank");
  const answer = document.querySelector("#sequence-answer");
  const feedback = document.querySelector("#sequence-feedback");
  let chosen = [];

  function renderSequence() {
    bank.innerHTML = shuffled.map(step => `<button type="button" data-step="${step}" ${chosen.includes(step) ? "disabled" : ""}>${step}</button>`).join("");
    answer.innerHTML = chosen.map(step => `<li>${step}</li>`).join("");
  }

  bank.addEventListener("click", event => {
    const button = event.target.closest("button[data-step]");
    if (!button || chosen.includes(button.dataset.step)) return;
    chosen.push(button.dataset.step);
    feedback.textContent = "";
    renderSequence();
  });
  document.querySelector("#sequence-undo").addEventListener("click", () => { chosen.pop(); feedback.textContent = ""; renderSequence(); });
  document.querySelector("#sequence-reset").addEventListener("click", () => { chosen = []; feedback.textContent = ""; renderSequence(); });
  document.querySelector("#sequence-check").addEventListener("click", () => {
    if (chosen.length < correct.length) {
      feedback.textContent = `還差 ${correct.length - chosen.length} 個步驟。`;
      return;
    }
    const success = chosen.every((step, index) => step === correct[index]);
    feedback.textContent = success ? "順序正確！安全從操作前的檢查開始。" : "還有步驟需要調整。想想：人和器材應該在什麼時候檢查？";
    if (success) document.dispatchEvent(new CustomEvent("sequencecomplete"));
  });
  renderSequence();
})();
