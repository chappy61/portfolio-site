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

async function showLog() {
  const logContainer = document.getElementById("log-output");
  const overlay = document.getElementById("log-overlay");
  logContainer.innerText = "";
  overlay.classList.remove("hidden");

  for (let line of logLines) {
    await new Promise(res => setTimeout(res, 500));
    logContainer.innerText += line + "\n";
  }

  // カーソル点滅
  const cursor = document.createElement("span");
  cursor.textContent = "█";
  cursor.style.animation = "blink 1s steps(1) infinite";
  logContainer.appendChild(cursor);
}

function closeLog() {
  document.getElementById("log-overlay").classList.add("hidden");
}
function showLog() {
  const overlay = document.getElementById("log-overlay");
  const logContainer = document.getElementById("log-output");
  overlay.classList.remove("hidden");

  // 一旦透明、再描画後にふわっと表示
  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });

  logContainer.innerText = "";
  let cursor = document.createElement("span");
  cursor.textContent = "█";
  cursor.classList.add("cursor");
  logContainer.appendChild(cursor);

  // タイピング演出
  (async () => {
    for (const line of logLines) {
      await new Promise(r => setTimeout(r, 600));
      cursor.before(document.createTextNode(line + "\n"));
    }
  })();
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
// 初期化
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme") || "mac";
  ThemeManager.setTheme(saved);

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", (event) => {
      ThemeManager.toggleTheme();
      createParticles?.(event);
    });
  }

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

  const chromeIcon = document.querySelector(".icon-chrome");
  let chromeRot = 0;
  if (chromeIcon) {
    chromeIcon.addEventListener("mouseenter", () => {
      chromeRot += 360;
      chromeIcon.style.transform = `rotate(${chromeRot}deg)`;
    });
  }

  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    setTimeout(() => overlay.classList.add("fade-out"), 2000);
  }

  // ログアニメーション開始
  typeLine();

  // リロード時のウィンドウ削除
  if (new URLSearchParams(location.search).get("fromApp")) {
    document.querySelectorAll(".dynamic-window").forEach(w => w.remove());
    history.replaceState(null, "", location.pathname);
  }
});
