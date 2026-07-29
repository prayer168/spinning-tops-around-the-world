(() => {
  const key = "spinning-tops-learning-progress-v1";
  const order = ["task", "science", "taiwan", "world", "safety", "quiz", "learn"];
  const label = document.querySelector("#progress-label");
  const bar = document.querySelector("#progress-bar");
  let visited = new Set(["task"]);

  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved)) visited = new Set(saved.filter(item => order.includes(item)));
  } catch (_) { /* localStorage may be unavailable in private contexts */ }

  function save() {
    try { localStorage.setItem(key, JSON.stringify([...visited])); } catch (_) { /* no-op */ }
  }

  function update() {
    const count = visited.size;
    label.textContent = `已探索 ${count}／${order.length}`;
    bar.style.width = `${(count / order.length) * 100}%`;
  }

  document.addEventListener("tabchange", event => {
    visited.add(event.detail.id);
    save();
    update();
  });
  document.querySelector("#reset-progress").addEventListener("click", () => {
    visited = new Set(["task"]);
    save();
    update();
    if (window.openCourseTab) window.openCourseTab("task", { scroll: true });
  });
  update();
})();

