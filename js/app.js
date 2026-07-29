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

  function starPoints(cx, cy, outerRadius, innerRadius, pointCount = 5, rotation = -90) {
    return Array.from({ length: pointCount * 2 }, (_, index) => {
      const angle = (rotation + index * 180 / pointCount) * Math.PI / 180;
      const radius = index % 2 ? innerRadius : outerRadius;
      return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
    }).join(" ");
  }

  function trigram(cx, cy, rotation, pattern) {
    const bars = pattern.map((solid, index) => {
      const y = (index - 1) * 11 - 3;
      return solid
        ? `<rect x="-22" y="${y}" width="44" height="6" rx="1"/>`
        : `<rect x="-22" y="${y}" width="18" height="6" rx="1"/><rect x="4" y="${y}" width="18" height="6" rx="1"/>`;
    }).join("");
    return `<g transform="translate(${cx} ${cy}) rotate(${rotation})" fill="#111">${bars}</g>`;
  }

  function createFlagSvg(item) {
    const spokes = Array.from({ length: 24 }, (_, index) =>
      `<line x1="150" y1="100" x2="150" y2="74" transform="rotate(${index * 15} 150 100)"/>`).join("");
    const euStars = Array.from({ length: 12 }, (_, index) => {
      const angle = index * 30 - 90;
      const x = 150 + Math.cos(angle * Math.PI / 180) * 59;
      const y = 100 + Math.sin(angle * Math.PI / 180) * 59;
      return `<polygon points="${starPoints(x, y, 9, 3.6)}"/>`;
    }).join("");
    const malaysiaStripes = Array.from({ length: 14 }, (_, index) =>
      `<rect x="0" y="${(index * 200 / 14).toFixed(2)}" width="400" height="${(200 / 14 + .2).toFixed(2)}" fill="${index % 2 ? "#fff" : "#cc0001"}"/>`).join("");
    const flags = {
      japan: { viewBox: "0 0 300 200", art: `<rect width="300" height="200" fill="#fff"/><circle cx="150" cy="100" r="60" fill="#bc002d"/>` },
      indonesia: { viewBox: "0 0 300 200", art: `<rect width="300" height="100" fill="#ce1126"/><rect y="100" width="300" height="100" fill="#fff"/>` },
      china: { viewBox: "0 0 300 200", art: `<rect width="300" height="200" fill="#ee1c25"/><g fill="#ffff00"><polygon points="${starPoints(50, 50, 30, 11.5)}"/><polygon points="${starPoints(100, 20, 10, 3.8, 5, 161.6)}"/><polygon points="${starPoints(120, 40, 10, 3.8, 5, 172.9)}"/><polygon points="${starPoints(120, 70, 10, 3.8, 5, -164.1)}"/><polygon points="${starPoints(100, 90, 10, 3.8, 5, -141.3)}"/></g>` },
      india: { viewBox: "0 0 300 200", art: `<rect width="300" height="66.67" fill="#ff9933"/><rect y="66.67" width="300" height="66.67" fill="#fff"/><rect y="133.34" width="300" height="66.66" fill="#138808"/><g fill="none" stroke="#000080" stroke-width="2"><circle cx="150" cy="100" r="27"/>${spokes}</g><circle cx="150" cy="100" r="3" fill="#000080"/>` },
      malaysia: { viewBox: "0 0 400 200", art: `${malaysiaStripes}<rect width="200" height="114.29" fill="#010066"/><circle cx="80" cy="57" r="36" fill="#ffcc00"/><circle cx="94" cy="57" r="30" fill="#010066"/><polygon points="${starPoints(137, 57, 25, 10, 14)}" fill="#ffcc00"/>` },
      korea: { viewBox: "0 0 300 200", art: `<rect width="300" height="200" fill="#fff"/><g transform="rotate(33.69 150 100)"><circle cx="150" cy="100" r="34" fill="#0047a0"/><path d="M116 100 A34 34 0 0 1 184 100 A17 17 0 0 1 150 100 A17 17 0 0 0 116 100Z" fill="#cd2e3a"/></g>${trigram(66, 52, -33.69, [true,true,true])}${trigram(234, 52, 33.69, [false,true,false])}${trigram(66, 148, 33.69, [true,false,true])}${trigram(234, 148, -33.69, [false,false,false])}` },
      mexico: { viewBox: "0 0 350 200", art: `<rect width="116.67" height="200" fill="#006847"/><rect x="116.67" width="116.66" height="200" fill="#fff"/><rect x="233.33" width="116.67" height="200" fill="#ce1126"/><g aria-hidden="true"><path d="M147 139 Q175 163 203 139" fill="none" stroke="#8c5b32" stroke-width="4"/><path d="M150 136 Q161 151 173 154M200 136 Q189 151 177 154" fill="none" stroke="#2e7d45" stroke-width="5"/><path d="M174 137v-35m0 10c-15-4-18-14-14-22m14 34c15-4 18-14 14-22" fill="none" stroke="#23733b" stroke-width="7" stroke-linecap="round"/><path d="M158 84 Q175 58 195 78 L207 72 Q198 91 184 97 Q171 102 162 119 L150 112 Q160 98 158 84Z" fill="#8a623f"/><path d="M157 84 Q142 94 145 107 Q157 102 166 91" fill="#76502f"/><circle cx="191" cy="80" r="2.4" fill="#111"/><path d="M197 84 Q210 91 216 83" fill="none" stroke="#3d6f36" stroke-width="3" stroke-linecap="round"/><path d="M153 139 Q145 132 140 122M197 139 Q205 132 210 122" fill="none" stroke="#a87832" stroke-width="3"/><g fill="#4f8b43"><ellipse cx="146" cy="128" rx="3" ry="7" transform="rotate(-38 146 128)"/><ellipse cx="204" cy="128" rx="3" ry="7" transform="rotate(38 204 128)"/></g></g>` },
      europe: { viewBox: "0 0 300 200", art: `<rect width="300" height="200" fill="#003399"/><g fill="#ffcc00">${euStars}</g>` }
    };
    const flag = flags[item.flagKey] || flags.europe;
    return `<svg class="flag-art" viewBox="${flag.viewBox}" role="img" aria-label="${item.flagName}" xmlns="http://www.w3.org/2000/svg"><title>${item.flagName}</title>${flag.art}</svg>`;
  }

  function createTopImage(item) {
    return `<img class="atlas-top-art" src="${item.topImage}" alt="${item.topAlt}" width="512" height="512" loading="lazy">`;
  }

  function renderAtlas(items) {
    const buttons = document.querySelector("#atlas-buttons");
    const detail = document.querySelector("#atlas-detail");
    const lightbox = document.querySelector("#flag-lightbox");
    const lightboxArt = document.querySelector("#flag-lightbox-art");
    const lightboxTitle = document.querySelector("#flag-lightbox-title");
    const lightboxNote = document.querySelector("#flag-lightbox-note");
    const lightboxSource = document.querySelector("#flag-lightbox-source");
    const lightboxClose = document.querySelector("#flag-lightbox-close");
    let lastVisualTrigger = null;

    function closeVisual() {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      document.body.classList.remove("is-flag-lightbox-open");
      lightboxArt.classList.remove("is-top-image");
      lastVisualTrigger?.focus();
    }

    function openVisual(item, type, trigger) {
      const isTop = type === "top";
      lastVisualTrigger = trigger;
      lightboxTitle.textContent = isTop ? item.topName : item.flagName;
      lightboxNote.textContent = isTop
        ? `${item.topAlt}。縮圖取自本教材已查核的世界圖鑑，放大寬度為卡片縮圖的 3 倍。`
        : `${item.flagNote} 圖像寬度為卡片旗幟的 3 倍。`;
      lightboxSource.href = isTop ? item.source : item.flagSource;
      lightboxSource.textContent = isTop ? "查看陀螺來源 ↗" : "查看官方旗幟來源 ↗";
      lightboxArt.classList.toggle("is-top-image", isTop);
      lightboxArt.innerHTML = isTop ? createTopImage(item) : createFlagSvg(item);
      lightbox.hidden = false;
      document.body.classList.add("is-flag-lightbox-open");
      lightboxClose.focus();
    }

    function select(item, moveFocus = false) {
      buttons.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.region === item.id)));
      detail.innerHTML = `
        <div class="atlas-detail-head">
          <div><p class="region-tag">CULTURE CARD · ${item.region}</p><h3>${item.region}</h3><p class="local-name">${item.localName}</p></div>
          <div class="atlas-card-visuals" role="group" aria-label="${item.region}的旗幟與代表陀螺">
            <button class="atlas-visual-trigger flag-zoom-trigger" type="button" aria-label="放大${item.flagName}至 3 倍" aria-haspopup="dialog">
              <span class="atlas-visual-frame atlas-flag-frame">${createFlagSvg(item)}</span>
              <span class="atlas-visual-caption">${item.flagName}<small>點擊放大 3×</small></span>
            </button>
            <button class="atlas-visual-trigger top-zoom-trigger" type="button" aria-label="放大${item.topName}至 3 倍" aria-haspopup="dialog">
              <span class="atlas-visual-frame">${createTopImage(item)}</span>
              <span class="atlas-visual-caption">${item.topName}<small>點擊放大 3×</small></span>
            </button>
          </div>
        </div>
        <dl>
          <dt>材料</dt><dd>${item.material}</dd>
          <dt>外形</dt><dd>${item.shape}</dd>
          <dt>啟動</dt><dd>${item.launch}</dd>
          <dt>玩法</dt><dd>${item.play}</dd>
          <dt>文化</dt><dd>${item.culture}</dd>
        </dl>
        <div class="atlas-source-links"><a href="${item.source}" target="_blank" rel="noreferrer">查看陀螺來源 ↗</a><a href="${item.flagSource}" target="_blank" rel="noreferrer">查看旗幟來源 ↗</a></div>`;
      detail.querySelector(".flag-zoom-trigger").addEventListener("click", event => openVisual(item, "flag", event.currentTarget));
      detail.querySelector(".top-zoom-trigger").addEventListener("click", event => openVisual(item, "top", event.currentTarget));
      if (moveFocus) detail.focus();
    }

    buttons.innerHTML = items.map((item, index) => `<button type="button" data-region="${item.id}" aria-pressed="${index === 0}">${item.region}</button>`).join("");
    buttons.addEventListener("click", event => {
      const button = event.target.closest("button[data-region]");
      if (!button) return;
      const item = items.find(entry => entry.id === button.dataset.region);
      if (item) select(item, true);
    });
    lightboxClose.addEventListener("click", closeVisual);
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeVisual();
    });
    document.addEventListener("keydown", event => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeVisual();
      if (event.key === "Tab") {
        const focusable = [...lightbox.querySelectorAll("button, a[href]")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
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
