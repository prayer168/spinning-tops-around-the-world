(() => {
  const order = ["task", "science", "taiwan", "world", "safety", "quiz", "learn"];
  const names = ["學習任務", "旋轉科學", "臺灣陀螺", "世界圖鑑", "操作安全", "圖像挑戰", "自主學習"];
  const tabs = [...document.querySelectorAll('[role="tab"][data-tab]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"][data-panel]')];
  const previous = document.querySelector("#previous-panel");
  const next = document.querySelector("#next-panel");
  const position = document.querySelector("#panel-position");
  let current = 0;

  function openTab(id, options = {}) {
    const index = order.indexOf(id);
    if (index < 0) return;
    current = index;
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
      panel.classList.toggle("is-entering", panelIndex === index);
    });
    previous.disabled = index === 0;
    next.disabled = index === order.length - 1;
    position.textContent = `${index + 1}／${order.length} · ${names[index]}`;
    history.replaceState(null, "", `#${id}`);
    document.dispatchEvent(new CustomEvent("tabchange", { detail: { id, index } }));
    if (options.focusTab) tabs[index].focus();
    if (options.scroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => openTab(tab.dataset.tab, { scroll: true }));
    tab.addEventListener("keydown", event => {
      let target = null;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target !== null) {
        event.preventDefault();
        openTab(order[target], { focusTab: true, scroll: false });
      }
    });
  });

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-open-tab]");
    if (!trigger) return;
    event.preventDefault();
    openTab(trigger.dataset.openTab, { scroll: true, focusTab: trigger.closest(".tabs") !== null });
  });

  previous.addEventListener("click", () => openTab(order[Math.max(0, current - 1)], { scroll: true }));
  next.addEventListener("click", () => openTab(order[Math.min(order.length - 1, current + 1)], { scroll: true }));

  window.openCourseTab = openTab;
  const hash = location.hash.slice(1);
  openTab(order.includes(hash) ? hash : "task", { scroll: false });
})();

