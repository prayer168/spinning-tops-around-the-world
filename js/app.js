(() => {
  const iconMap = { axis: "↕", momentum: "↻", torque: "⌁", precession: "◌", friction: "≈", design: "◎" };

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`無法讀取 ${path}`);
    return response.json();
  }

  function renderScience(concepts) {
    const host = document.querySelector("#science-concepts");
    host.innerHTML = concepts.map(item => `
      <article class="concept-card">
        <span class="concept-icon" aria-hidden="true">${iconMap[item.visual] || "◎"}</span>
        <span class="tag">${item.keyword}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </article>`).join("");
  }

  function renderTaiwan(items) {
    const host = document.querySelector("#taiwan-top-types");
    host.innerHTML = items.map(item => `
      <article class="top-type-card">
        <figure>
          <img src="${item.image}" alt="${item.alt}" width="900" height="900" loading="lazy">
          <figcaption>${item.visualCaption}</figcaption>
        </figure>
        <header><h3>${item.name}</h3><span>${item.type}</span></header>
        <dl>
          <dt>材料</dt><dd>${item.material}</dd>
          <dt>啟動</dt><dd>${item.launch}</dd>
          <dt>玩法</dt><dd>${item.play}</dd>
          <dt>安全</dt><dd>${item.safety}</dd>
        </dl>
      </article>`).join("");
  }

  function renderAtlas(items) {
    const buttons = document.querySelector("#atlas-buttons");
    const detail = document.querySelector("#atlas-detail");

    function select(item, moveFocus = false) {
      buttons.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.region === item.id)));
      detail.innerHTML = `
        <p class="region-tag">CULTURE CARD · ${item.region}</p>
        <h3>${item.region}</h3>
        <p class="local-name">${item.localName}</p>
        <dl>
          <dt>材料</dt><dd>${item.material}</dd>
          <dt>外形</dt><dd>${item.shape}</dd>
          <dt>啟動</dt><dd>${item.launch}</dd>
          <dt>玩法</dt><dd>${item.play}</dd>
          <dt>文化</dt><dd>${item.culture}</dd>
        </dl>
        <a href="${item.source}" target="_blank" rel="noreferrer">查看機構來源 ↗</a>`;
      if (moveFocus) detail.focus();
    }

    buttons.innerHTML = items.map((item, index) => `<button type="button" data-region="${item.id}" aria-pressed="${index === 0}">${item.region}</button>`).join("");
    buttons.addEventListener("click", event => {
      const button = event.target.closest("button[data-region]");
      if (!button) return;
      const item = items.find(entry => entry.id === button.dataset.region);
      if (item) select(item, true);
    });
    select(items[0]);
  }

  function renderResources(items) {
    const host = document.querySelector("#resource-list");
    host.innerHTML = items.map(item => `
      <a class="resource-item" href="${item.url}" target="_blank" rel="noreferrer">
        <span>${item.type}<br>${item.grade}</span>
        <strong>${item.title}</strong>
        <p>${item.organization}｜${item.description}<br>查核：${item.checkedAt}</p>
        <b aria-hidden="true">↗</b>
      </a>`).join("");
  }

  async function init() {
    try {
      const [content, resources] = await Promise.all([loadJson("data/content.json"), loadJson("data/resources.json")]);
      renderScience(content.scienceConcepts);
      renderTaiwan(content.taiwanTops);
      renderAtlas(content.worldTops);
      renderResources(resources);
      window.CourseData = { content, resources };
      document.dispatchEvent(new CustomEvent("course-data-ready"));
    } catch (error) {
      console.error(error);
      document.querySelectorAll("#science-concepts, #taiwan-top-types, #atlas-buttons, #resource-list").forEach(host => {
        if (!host.children.length) host.innerHTML = `<p role="alert">教材資料暫時無法載入，請使用本機伺服器或重新整理頁面。</p>`;
      });
    }
  }

  init();
})();
