// index.js: index.html専用（bootlog + nodes + 初期化）

import { initMobileUI } from "./mobile.js";

import { onReady, safeInit } from "./global.js";
import { initTheme } from "./theme.js";
import { initSigLostLog } from "./siglost.js";


// ---- 状態管理 ----
let currentLine = 0;
let currentChar = 0;
let isFastForward = false;
let typingInterrupted = false;
let timerId = null;

const TYPE_SPEED = 40;
const LINE_DELAY = 300;
const LEFT_COL_WIDTH = 59;


function getNowJST() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  return `${y}.${m}.${d} ${h}:${min}:${s} JST`;
}
// ---- 起動ログ ----
const timeLineLeft =
  `[OK]   Time Sync: ${getNowJST()} (local)`.padEnd(LEFT_COL_WIDTH, " ");

const bootLines = [
  "[BOOT] Portfolio Virtual OS v1.02 initializing...          ■ :: SYSTEM MONITOR",
  "[INFO] Loading modules: UI / Motion / LogSystem            CPU     : █████░░░░ 48%",
    `${timeLineLeft}Memory  : ██████░░░ 64%`,
  "[OK]   Visual Interface: WIN-THEME engaged                 Process : ACTIVE",
  "[INFO] Injecting personality core... success               Thermal : NORMAL",
  "[WARN] Identity signature ambiguous                        Uptime  : 00:09:41",
  "[OK]   Class: Human (temporary)                            Status  : STABLE (mostly)",
  "[OK]   Role: Designer / Engineer / Dreamer",
  "[INFO] Coffee level: LOW",
  "[WARN] Motivation spike detected",
  "[INFO] Searching memory fragments...",
  "[OK]   Found answer from past self",
  "[SYS]  Writing to memory: Me()",
  "[READY] <span class='command'>profile.run()</span>",
  "",
];

function renderLineHTML(line, isReadyLine = false) {
  if (!isReadyLine) {
    if (line === "") return `<div class="log-row">&nbsp;</div>`;
    return `<div class="log-row">${line}</div>`;
  }

  // READY行（改行・インデント無しで生成する）
  return `<div class="log-row log-ready"><span class="ready-left">[READY] <span class="command">profile.run()</span> →</span><a href="#profile" class="profile-link">VIEW PROFILE</a></div>`;
}


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
    const rows = bootLogEl.querySelectorAll(".log-row");
    const targetIndex = bootLines.length - 2;

    if (rows[targetIndex]) {
      rows[targetIndex].outerHTML = renderLineHTML(null, true).trim();
    }

    const profileLink = bootLogEl.querySelector(".profile-link");
    profileLink && setTimeout(() => profileLink.classList.add("visible"), 400);

    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 800);
    }
    return;
  }

  const line = bootLines[currentLine];

  // 新しい行を作る
  if (currentChar === 0) {
    const div = document.createElement("div");
    div.className = "log-row";
    bootLogEl.appendChild(div);
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
// ブートログ初期化
// ==========================
export function initBootLog() {
  const bootLogEl = document.querySelector(".boot-log");
  if (!bootLogEl) return;

  const overrideBtn = document.querySelector(".override-btn");
  const rebootBtn = document.querySelector(".reboot-btn");
  const shutdownBtn = document.querySelector(".shutdown-btn");

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

    const targetIndex = bootLines.length - 2;

    const html = bootLines.map((l, i) =>
      renderLineHTML(l, i === targetIndex).trim()
    );

    bootLogEl.innerHTML = html.join("");

    const profileLink = bootLogEl.querySelector(".profile-link");
    profileLink && setTimeout(() => profileLink.classList.add("visible"), 400);
  });
}
document.addEventListener("click", e => {
  if (e.target.classList.contains("profile-link")) {
    const log = document.querySelector(".boot-log");
    const div = document.createElement("div");
    div.className = "log-row";
    div.textContent = "[INFO] Switching context...";
    log.appendChild(div);
  }
});

// ==========================
// ノード初期化
// ==========================
export function initNodes() {
  const icons = document.querySelectorAll(".icon, .game-icon");
  if (!icons.length) return;

  icons.forEach(icon => {
    icon.addEventListener("click", () => {
      console.log("icon clicked:", icon.id);
    });
  });
}
async function injectPartial(mountSelector, url) {
  const mount = document.querySelector(mountSelector);
  if (!mount) {
    console.warn(`[partial] mount not found: ${mountSelector}`);
    return false;
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.warn(`[partial] failed: ${url}`, res.status);
    return false;
  }
  mount.innerHTML = await res.text();
  return true;
}

async function initMobilePartial() {
  await injectPartial("#partial-mobile", "partials/mobile-home.html");
}

onReady(async () => {
  // ① まず partial を入れる（これがないとイベント付かない）
  await initMobilePartial();

  // ② いつもの初期化
  safeInit("Theme", initTheme);
  safeInit("BootLog", initBootLog);
  safeInit("Nodes", initNodes);
  safeInit("SigLost", initSigLostLog);

  // ③ mobile UI初期化（注入後に必ず）
  safeInit("MobileUI", initMobileUI);
});
