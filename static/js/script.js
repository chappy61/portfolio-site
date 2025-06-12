// ==========================
// 定数定義・共通設定
// ==========================
let zIndex = 100;
const offset = 30;
const windowWidth = 350;
const windowHeight = 200;
const openedWindows = new Map();
let rotation = 0; // テーマ切り替え用回転制御

// ==========================
// テーマ管理・切り替え処理
// ==========================
const ThemeManager = {
  currentTheme: null,

  setTheme(theme) {
    document.body.classList.remove("mac-theme", "win-theme", "chrome-theme", "safari-theme");
    document.body.classList.add(`${theme}-theme`);
    document.body.classList.add(theme === "mac" ? "safari-theme" : "chrome-theme");

    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.updateButtonGlow();
    delayedPositionNodes();
  },

toggleTheme() {
  const newTheme = this.currentTheme === "mac" ? "win" : "mac";
  this.setTheme(newTheme);

  rotation += 180;
  const star = document.querySelector(".star-outline");
  if (star) {
    star.style.transform = `rotate(${rotation}deg)`;
  }
},


  updateButtonGlow() {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    btn.classList.remove("mac-glow", "win-glow");
    btn.classList.add(this.currentTheme === "mac" ? "mac-glow" : "win-glow");
  }
};

// ==========================
// 粒子エフェクト
// ==========================
function createParticles(event) {
  const theme = ThemeManager.currentTheme;
  const colors = {
    mac: ["#f8bbd0", "#e1bee7", "#d1c4e9"],
    win: ["#b0f0ff", "#cc99ff", "#8888aa"]
  }[theme] || ["#ffffff"];

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 8px ${color}`;
    document.body.appendChild(particle);

    const x = event.clientX + (Math.random() * 20 - 10);
    const y = event.clientY + (Math.random() * 20 - 10);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 30 + 20;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;

    setTimeout(() => {
      particle.style.transform = `translate(${targetX - x}px, ${targetY - y}px) scale(1.2)`;
      particle.style.opacity = "0";
    }, 50);

    setTimeout(() => particle.remove(), 1500);
  }
}
// ==========================
// 自己紹介
// ==========================
const logLines = [
  ">>> SYSTEM INITIALIZED",
  ">>> USER IDENTIFIED: \"あなたの名前\"",
  ">>> PROFILE LOADED",
  ">>> ROLE: Frontend Developer / Designer",
  ">>> CURRENT PROJECT: Portfolio Interface v1.0",
  ">>> STATUS: Dreaming in Code..."
];

function showLog() {
  const overlay = document.getElementById("log-overlay");
  const logContainer = document.getElementById("log-output");

  // 初期化
  overlay.classList.remove("hidden");
  logContainer.innerText = "";

  // 再描画後にふわっと表示（CSS側で .active にアニメ）
  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });

  // カーソル要素
  const cursor = document.createElement("span");
  cursor.textContent = "█";
  cursor.classList.add("cursor");
  logContainer.appendChild(cursor);

  // タイピング風に順に追加
  (async () => {
    for (const line of logLines) {
      await new Promise(res => setTimeout(res, 600));
      cursor.before(document.createTextNode(line + "\n"));
    }
  })();

  // クリックで閉じる
  overlay.addEventListener("click", closeLog, { once: true });
}

function closeLog() {
  const overlay = document.getElementById("log-overlay");
  overlay.classList.remove("active");
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 300); // アニメ完了後に非表示
}


// ==========================
// ログアニメーション（SIG LOST含む）
// ==========================
const lines = [
  "INIT... OK", "SYS_LOAD: 32.44%", "CHKPOINT> Δ==≡==Δ==●",
  "PROTOCOL: B9X1-22", "SIG: 0x23FF3A :: OK", "SIG: 0x1201DC :: OK",
  "SIG: 0xFFFF__ERR", "//// SYSTEM REBUILD ////", "DATA: >>> ∆ ∆ ∆ ∆ ∆ ∆ ∆",
  "ID: X-2039-VOID-STATE", "LOOP", "LOOP", "LOOP"
];

let lineIndex = 0;
const logBody = document.getElementById("logBody");
const cursor = document.getElementById("cursor");

function typeLine() {
  if (lineIndex >= lines.length) return startCorruption();

  const line = lines[lineIndex++];
  const div = document.createElement("div");
  logBody.insertBefore(div, cursor);

  let charIndex = 0;
  function typeChar() {
    if (charIndex < line.length) {
      div.textContent += line[charIndex++];
      logBody.scrollTop = logBody.scrollHeight;
      setTimeout(typeChar, 40 + Math.random() * 35);
    } else {
      setTimeout(typeLine, 150);
    }
  }

  typeChar();
}

function startCorruption() {
  let count = 0;
  const interval = setInterval(() => {
    const div = document.createElement("div");
    div.textContent = "SIG LOST.";
    div.style.opacity = 0.3 + Math.random() * 0.4;
    div.style.color = "#ff2b2b";
    logBody.insertBefore(div, cursor);
    logBody.scrollTop = logBody.scrollHeight;
    if (++count > 12) {
      clearInterval(interval);
      setTimeout(restartTyping, 4000);
    }
  }, 100);
}

function restartTyping() {
  lineIndex = 0;
  logBody.innerHTML = "";
  logBody.appendChild(cursor);
  typeLine();
}

// ==========================
// ウィンドウ生成・管理
// ==========================
function createWindow(app, url) {
  const windowEl = document.createElement("div");
  windowEl.classList.add("window", "dynamic-window");

  const left = (window.innerWidth - windowWidth) / 2;
  const top = (window.innerHeight - windowHeight) / 2;

  Object.assign(windowEl.style, {
    left: `${left}px`,
    top: `${top}px`,
    zIndex: ++zIndex,
    opacity: "0",
    transform: "scale(0.8)",
    transition: "all 0.3s ease"
  });

  let bodyContent = `
    <pre><code>
<span class="keyword">class</span> <span class="class">Me</span>:
    <span class="keyword">def</span> <span class="prop">__init__</span>(self):
        self.name = <span class="string">"${app}"</span>
        self.from_ = <span class="string">"日本"</span>
        self.skills = [<span class="string">"Python"</span>, <span class="string">"Flask"</span>, <span class="string">"CSS"</span>]
        self.vision = <span class="string">"技術で表現する、心地よい世界。"</span>
    </code></pre>
  `;

  if (url) {
    const themeClass = document.body.classList.contains("mac-theme") ? "loading-bar-mac" : "loading-bar-win";
    bodyContent = `
      <div class="loading-bar-container">
        <p class="loading-text">Now Loading...</p>
        <div class="${themeClass}"></div>
      </div>
    `;
    setTimeout(() => {
      window.location.href = `${url}?fromApp=true`;
    }, 3000);
  }

  windowEl.innerHTML = `
    <div class="window-header">
      <span class="red close-btn"></span>
      <span class="yellow"></span>
      <span class="green"></span>
    </div>
    <div class="window-body">${bodyContent}</div>
  `;

  document.body.appendChild(windowEl);
  makeDraggable(windowEl);

  requestAnimationFrame(() => {
    windowEl.style.opacity = "1";
    windowEl.style.transform = "scale(1)";
  });

  windowEl.querySelector(".close-btn").addEventListener("click", () => {
    windowEl.remove();
    openedWindows.delete(app);
  });

  return windowEl;
}

// ==========================
// ドラッグ処理
// ==========================
function makeDraggable(el) {
  const header = el.querySelector(".window-header");
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    el.style.zIndex = zIndex++;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// ==========================
// 初期化処理
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.setTheme(localStorage.getItem("theme") || "win");

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", e => {
      ThemeManager.toggleTheme();
      createParticles?.(e);
    });
  }

  // アイコンクリックでウィンドウ開く
  document.querySelectorAll(".icon a").forEach(icon => {
    icon.addEventListener("click", e => {
      e.preventDefault();
      const app = icon.dataset.app;
      const href = icon.getAttribute("href");
      const isLink = icon.dataset.link === "true";

      const opened = openedWindows.get(app);
      if (opened) {
        let left = parseInt(opened.style.left) + offset;
        let top = parseInt(opened.style.top) + offset;
        if (left + windowWidth > window.innerWidth) left = 100;
        if (top + windowHeight > window.innerHeight) top = 100;
        Object.assign(opened.style, { left: `${left}px`, top: `${top}px`, zIndex: ++zIndex });
      } else {
        const newWin = createWindow(app, isLink ? href : null);
        openedWindows.set(app, newWin);
      }
    });
  });

  // Chromeアイコン回転アニメーション
  const chromeIcon = document.querySelector(".icon-chrome");
  let chromeRot = 0;
  if (chromeIcon) {
    chromeIcon.addEventListener("mouseenter", () => {
      chromeRot += 360;
      chromeIcon.style.transform = `rotate(${chromeRot}deg)`;
    });
  }

  // ローディングオーバーレイ
  const overlay = document.getElementById("loading-overlay");
  if (overlay) setTimeout(() => overlay.classList.add("fade-out"), 2000);

  typeLine?.();

  if (new URLSearchParams(location.search).get("fromApp")) {
    document.querySelectorAll(".dynamic-window").forEach(w => w.remove());
    history.replaceState(null, "", location.pathname);
  }

  // =====================
  // ノード表示トグル
  // =====================
  const icons = document.querySelectorAll('.icon');
  const nodes = document.querySelectorAll('.node-wrapper.mac-only');

  nodes.forEach(node => {
    node.addEventListener('click', e => {
      // アイコンクリックで開く時とバッティングしないように
      if (e.target.closest('.close-btn')) return;

      node.classList.toggle('active');
      updateLines();
    });
  });

  // ノード内のcloseボタンが動くように（今は無くてもOK）
  document.querySelectorAll('.node-wrapper .close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const node = btn.closest('.node-wrapper');
      if (node) node.classList.remove('active');
    });
  });
});


// ==========================
// ノード位置調整（右端はみ出し防止付き）
// ==========================
function positionNodes() {
  const nodes = document.querySelectorAll(".node-wrapper[data-target]");
  nodes.forEach(wrapper => {
    const targetSelector = wrapper.getAttribute("data-target");
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.error(`Target not found for selector: ${targetSelector}`);
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const nodeWidth = wrapper.offsetWidth;

    // 右端からはみ出さないように最大値設定
    const desiredLeft = targetRect.right + window.scrollX + 15;
    const maxRight = window.innerWidth + window.scrollX - nodeWidth - 10;
    wrapper.style.position = "absolute";
    wrapper.style.left = Math.min(desiredLeft, maxRight) + "px";

    // 垂直はターゲットの中央に合わせる
    wrapper.style.top = (targetRect.top + window.scrollY + (targetRect.height / 2) - (wrapper.offsetHeight / 2)) + "px";

    // 特別な調整例
    if (targetSelector === "#warning-c") {
      wrapper.style.top = `${targetRect.top + window.scrollY + 10}px`;
    }
  });
}

// ==========================
// 線の描画更新
// ==========================
function updateLines() {
  const nodes = document.querySelectorAll(".node-wrapper[data-target]");
  nodes.forEach(wrapper => {
    const targetSelector = wrapper.getAttribute("data-target");
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.error(`Target not found for selector: ${targetSelector}`);
      return;
    }

    const lines = wrapper.querySelectorAll(".line");
    lines.forEach(line => {
      line.style.width = "0px";
      line.style.transform = "rotate(0deg)";
    });

    const wrapperRect = wrapper.getBoundingClientRect();

    lines.forEach(line => {
      const sourceSelector = line.getAttribute("data-source");
      let sourceElem = sourceSelector ? document.querySelector(sourceSelector) : null;

      const startX = wrapperRect.left + wrapper.offsetWidth / 2;
      const startY = wrapperRect.top + wrapper.offsetHeight / 2;

      let endX, endY;
      if (sourceElem) {
        const sourceRect = sourceElem.getBoundingClientRect();
        endX = sourceRect.left + sourceRect.width / 2;
        endY = sourceRect.top + sourceRect.height / 2;
      } else {
        const targetRect = target.getBoundingClientRect();
        endX = targetRect.left + targetRect.width / 2;
        endY = targetRect.top + targetRect.height / 2;
      }

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      line.style.position = "absolute";
      line.style.left = `${wrapper.offsetWidth / 2}px`;
      line.style.top = `${wrapper.offsetHeight / 2}px`;
      line.style.width = `${distance}px`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.transformOrigin = "left center";

      console.log(`Line updated for ${targetSelector}: distance=${distance}, angle=${angle}`);
    });
  });
}

// ==========================
// 遅延実行で位置調整
// ==========================
function delayedPositionNodes() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      positionNodes();
      updateLines();
    });
  });
}

// ==========================
// 初期化＋イベント登録
// ==========================
function initNodeUI() {
  delayedPositionNodes();

  // ノードクリックでトグル表示
  document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("click", (e) => {
      const iconId = icon.id;
      console.log("Icon clicked:", iconId);
      const nodeWrapper = document.querySelector(`.node-wrapper[data-target="#${iconId}"]`);
      if (nodeWrapper) {
        document.querySelectorAll(".node-wrapper").forEach(el => el.classList.add("visible"));
        nodeWrapper.classList.toggle("active");
        updateLines();
      } else {
        console.error(`Node wrapper not found for ${iconId}`);
      }
    });
  });
}

// ==========================
// DOMイベントの登録
// ==========================
document.addEventListener("DOMContentLoaded", initNodeUI);
window.addEventListener("load", initNodeUI);
window.addEventListener("resize", delayedPositionNodes);

// ==========================
// アイコンのクリック処理（リンク遷移）
// ==========================
document.querySelectorAll(".icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    const iconId = icon.id;
    const nodeWrapper = document.querySelector(`.node-wrapper[data-target="#${iconId}"]`);
    if (nodeWrapper) {
      document.querySelectorAll(".node-wrapper").forEach(el => el.classList.add("visible"));
      nodeWrapper.classList.toggle("active");
      updateLines();
      requestAnimationFrame(() => {
        const rect = nodeWrapper.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      });
      const href = icon.querySelector("a")?.getAttribute("href");
      if (href && icon.querySelector("a")?.dataset.link === "true") {
        setTimeout(() => {
          window.location.href = href;
        }, 3000);
      }
    }
  });
});