// ==========================
// 定数定義・共通設定
// ==========================
let zIndex = 100;
const offset = 30;
const windowWidth = 350;
const windowHeight = 200;
const openedWindows = new Map();

// ==========================
// ランドスケープ
// ==========================
window.addEventListener("resize", () => {
  // 画面幅によってクラス切り替え等を実装可能
});
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

    // 🎯 ノード説明モードの切り替え
    if (newTheme === "mac") {
      // 説明モードに入る
      document.body.classList.add("explain-mode");
      document.querySelectorAll('.node-wrapper').forEach(n => n.classList.add('visible'));
      document.querySelectorAll('.icon, .game-icon').forEach(icon => icon.classList.add('inactive'));
      updateLines(); // ←線の再描画（必要に応じて）
    } else {
      // 通常モードに戻る
      document.body.classList.remove("explain-mode");
      document.querySelectorAll('.node-wrapper').forEach(n => n.classList.remove('visible', 'active'));
      document.querySelectorAll('.icon, .game-icon').forEach(icon => icon.classList.remove('inactive'));
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
// 起動ログメッセージ
// ==========================
const bootLines = [
  "[BOOT] Portfolio Virtual OS v1.02 initializing.....          ■ :: SYSTEM MONITOR",
  "[INFO] Loading modules: UI / Particles / LogSystem          CPU : █████░░░ 48%",
  "[ OK ] Time Sync: 2025.06.16 21:12:04 JST                Memory : ██████░░ 64%",
  "[ OK ] Visual Interface: win-theme.engaged                 Mode : WIN-THEME",
  "[INFO] Injecting personality core... success.            Status : ACTIVE",
  "[INFO] Scanning identity parameters...                   Target : /User/Portfolio",
  "[ OK ] Language: Japanese                                  Auth : Local",
  "[WARN] Identity signature is ambiguous               Confidence : 72.4%",
  "[ OK ] Class: Human                                   Alignment : Chaotic Good",
  "[ OK ] Type: Designer / Engineer / Dreamer                 Role : Self-taught",
  "[.SYS] Hashing experiences...                             Count : 47 fragments",
  "[ OK ] Affinity: Minimal UI / Particle Systems / Motion Design",
  "[INFO] Installing emotional layers...                     Style : 感覚 × 技術",
  "[ OK ] Vision: '技術で表現する、心地よい世界。'",
  "[.SYS] Writing to memory: Me()",
  "[READY] <span class='command'>profile.run()</span>",
  "",
];

// ==========================
// 変数管理
// ==========================
let currentLine = 0;
let currentChar = 0;
let isFastForward = false;
let typingInterrupted = false;

const TYPE_SPEED = 40;
const LINE_DELAY = 300;

const bootLogEl = document.querySelector('.boot-log');
const overrideBtn = document.querySelector('.override-btn');
const rebootBtn = document.querySelector('.reboot-btn');
const shutdownBtn = document.querySelector('.shutdown-btn');

// ==========================
// タイピング処理
// ==========================
function typeNextChar() {
  if (typingInterrupted) return;

  // 最終行到達
  if (currentLine >= bootLines.length) {
    const lines = bootLogEl.querySelectorAll('div');
    const targetLineIndex = bootLines.length - 2;
    const updatedLine = `[READY] <span class="command">profile.run()</span> → <a href="#profile" class="profile-link">VIEW PROFILE</a>`;
    if (lines[targetLineIndex]) {
      lines[targetLineIndex].innerHTML = updatedLine;
    }

    const profileLink = bootLogEl.querySelector('.profile-link');
    setTimeout(() => {
      profileLink.classList.add('visible');
    }, 500);
    return;
  }

  const line = bootLines[currentLine];
  if (currentChar === 0) {
    const div = document.createElement('div');
    bootLogEl.appendChild(div);
  }

  const lineEl = bootLogEl.lastElementChild;
  lineEl.innerHTML += line[currentChar];
  currentChar++;

  const speed = isFastForward ? 5 : TYPE_SPEED;
  if (currentChar < line.length) {
    setTimeout(typeNextChar, speed);
  } else {
    currentLine++;
    currentChar = 0;
    const delay = isFastForward ? 20 : LINE_DELAY;
    setTimeout(typeNextChar, delay);
  }
}

// ==========================
// 起動時スタート
// ==========================
window.addEventListener('load', () => {
  typeNextChar();
});

// ==========================
// OVERRIDE（早送り）
// ==========================
overrideBtn.addEventListener('click', () => {
  isFastForward = !isFastForward;
  overrideBtn.style.color = isFastForward ? '#e33e3e' : '#bbb';
});

// ==========================
// REBOOT（やり直し）
// ==========================
rebootBtn.addEventListener('click', () => {
  // 状態リセット
  currentLine = 0;
  currentChar = 0;
  isFastForward = false;
  typingInterrupted = false;

  // 表示クリア
  bootLogEl.innerHTML = '';
  bootLogEl.scrollTop = 0;
  overrideBtn.style.color = '#bbb';
  bootLogEl.classList.remove('shutdown-mode');

  // 再スタート
  typeNextChar();
});

// ==========================
// SHUTDOWN（全文表示）
// ==========================
shutdownBtn.addEventListener('click', () => {
  typingInterrupted = true; // ← タイピングを中断
  bootLogEl.innerHTML = ''; // ← 表示クリア

  // 各行を <div> にして構築
  const logLinesHTML = bootLines.map(line => `<div>${line}</div>`);

  // 最後の行を差し替え
  const updatedLine = `<div>[READY] <span class="command">profile.run()</span> → <a href="#profile" class="profile-link">VIEW PROFILE</a></div>`;
  logLinesHTML[bootLines.length - 2] = updatedLine;

  bootLogEl.innerHTML = logLinesHTML.join('');

  const profileLink = bootLogEl.querySelector('.profile-link');
  setTimeout(() => {
    profileLink.classList.add('visible');
  }, 500);
});

// ==========================
// 自己紹介
// ==========================
const logLines = [
  ">>> initializing...",
  ">>> system booting sequence start",
  ">>> establishing neural link...",
  ">>> ユーザー確認: 『 下 川  美 弥 』",
  ">>> プロファイル読込完了",
  ">>> ロール: フロントエンドエンジニア / UIデザイナー",
  ">>> 主な使用技術: HTML, CSS, JavaScript, React, Figma",
  ">>> 特性: インタラクション重視 / 情緒的UI設計",
  ">>> 最近の取り組み: ノードUI + 粒子表現 + ウィンドウUI",
  ">>> 現在の作業: Portfolio Interface v1.0",
  ">>> モード: 自己紹介ログ（REPORT MODE）",
  ">>> 状態: 静かに、コードの夢を見ています",
  ">>> LOG END",
  ">>> システムはスリープ状態に入りました",
  ">>> 何かをクリックすると再起動します...",
  ""
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
  }, 300);
}

// ✅ Bootスクリーンをクリックしたら showLog を呼び出すようにする！
const bootScreen = document.getElementById("boot-screen");

bootScreen.addEventListener("click", () => {
  const overlay = document.getElementById("log-overlay");
  if (!overlay.classList.contains("active")) {
    showLog();
  }
});


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
  const icons = document.querySelectorAll('.icon, .game-icon');
  const nodes = document.querySelectorAll('.node-wrapper.mac-only');

  nodes.forEach(node => {
    node.addEventListener('click', e => {
      // アイコンクリックで開く時とバッティングしないように
      if (e.target.closest('.close-btn')) return;

      node.classList.toggle('active');
      updateLines();
    });
  });

  // ノード内のcloseボタンが動くように
  document.querySelectorAll('.node-wrapper .close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const node = btn.closest('.node-wrapper');
      if (node) node.classList.remove('active');
    });
  });
});
// ==========================
// ノード位置調整
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

    // 基本位置：ターゲットの右側
    let desiredLeft = targetRect.right + window.scrollX + 15;

    // left-nodeなら左側に表示する
    if (wrapper.classList.contains('left-node')) {
      desiredLeft = targetRect.left + window.scrollX - nodeWidth - 15;
    }

    const maxRight = window.innerWidth + window.scrollX - nodeWidth - 10;

    wrapper.style.position = "absolute";
    wrapper.style.left = Math.min(desiredLeft, maxRight) + "px";

    // 垂直中央に合わせる
    wrapper.style.top = (
      targetRect.top + window.scrollY + targetRect.height / 2 - wrapper.offsetHeight / 2
    ) + "px";

    // 特別な調整例（任意）
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
  document.querySelectorAll(".icon, .game-icon").forEach(icon => {
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
document.querySelectorAll(".icon, .game-icon").forEach(icon => {
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