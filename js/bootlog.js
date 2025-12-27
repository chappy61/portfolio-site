// ==========================
// bootlog.js 完成版（安定動作）
// ==========================

// ---- 状態管理 ----
let currentLine = 0;
let currentChar = 0;
let isFastForward = false;
let typingInterrupted = false;
let timerId = null;

const TYPE_SPEED = 40;
const LINE_DELAY = 300;

// ---- 起動ログ ----
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
// 内部ユーティリティ
// ==========================
function clearTimer() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function resetState(bootLogEl) {
  clearTimer();
  currentLine = 0;
  currentChar = 0;
  isFastForward = false;
  typingInterrupted = false;
  bootLogEl.innerHTML = "";
}

// ==========================
// タイピング本体
// ==========================
function typeNextChar(bootLogEl) {
  if (!bootLogEl || typingInterrupted) return;

  // 全行完了
  if (currentLine >= bootLines.length) {
    const lines = bootLogEl.querySelectorAll("div");
    const targetIndex = bootLines.length - 2;

    if (lines[targetIndex]) {
      lines[targetIndex].innerHTML =
        `[READY] <span class="command">profile.run()</span> → 
         <a href="#profile" class="profile-link">VIEW PROFILE</a>`;
    }

    const profileLink = bootLogEl.querySelector(".profile-link");
    if (profileLink) {
      setTimeout(() => profileLink.classList.add("visible"), 400);
    }

    console.log("✅ Boot sequence finished");
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 800);
    }
    return;
  }

  const line = bootLines[currentLine];

  if (currentChar === 0) {
    bootLogEl.appendChild(document.createElement("div"));
  }

  const row = bootLogEl.lastElementChild;
  row.innerHTML += line[currentChar] ?? "";
  currentChar++;

  const speed = isFastForward ? 5 : TYPE_SPEED;

  if (currentChar < line.length) {
    timerId = setTimeout(() => typeNextChar(bootLogEl), speed);
  } else {
    currentLine++;
    currentChar = 0;
    timerId = setTimeout(() => typeNextChar(bootLogEl), LINE_DELAY);
  }
}

// ==========================
// 初期化（外部から呼ばれる）
// ==========================
export function initBootLog() {
  const bootLogEl = document.querySelector(".boot-log");
  if (!bootLogEl) {
    console.warn("[BootLog] .boot-log not found, skipped");
    return;
  }

  const overrideBtn = document.querySelector(".override-btn");
  const rebootBtn = document.querySelector(".reboot-btn");
  const shutdownBtn = document.querySelector(".shutdown-btn");

  // 初期化して開始
  resetState(bootLogEl);
  typeNextChar(bootLogEl);

  // ---- OVERRIDE（早送り）----
  overrideBtn?.addEventListener("click", () => {
    isFastForward = !isFastForward;
    overrideBtn.style.color = isFastForward ? "#e33e3e" : "#bbb";
  });

  // ---- REBOOT（やり直し）----
  rebootBtn?.addEventListener("click", () => {
    resetState(bootLogEl);
    typeNextChar(bootLogEl);
    overrideBtn && (overrideBtn.style.color = "#bbb");
  });

  // ---- SHUTDOWN（全文表示）----
  shutdownBtn?.addEventListener("click", () => {
    typingInterrupted = true;
    clearTimer();

    const html = bootLines.map(l => `<div>${l}</div>`);
    html[bootLines.length - 2] =
      `<div>[READY] <span class="command">profile.run()</span> → 
        <a href="#profile" class="profile-link">VIEW PROFILE</a></div>`;

    bootLogEl.innerHTML = html.join("");

    const profileLink = bootLogEl.querySelector(".profile-link");
    profileLink && setTimeout(() => profileLink.classList.add("visible"), 400);
  });
}
