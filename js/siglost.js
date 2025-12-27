// js/siglost.js
let lineIndex = 0;
let typingTimer = null;
let corruptionTimer = null;

const lines = [
  "INIT... OK",
  "SYS_LOAD: 32.44%",
  "CHKPOINT> Δ==≡==Δ==●",
  "PROTOCOL: B9X1-22",
  "SIG: 0x23FF3A :: OK",
  "SIG: 0x1201DC :: OK",
  "SIG: 0xFFFF__ERR",
  "//// SYSTEM REBUILD ////",
  "DATA: >>> ∆ ∆ ∆ ∆ ∆ ∆ ∆",
  "ID: X-2039-VOID-STATE",
  "LOOP",
  "LOOP",
  "LOOP",
];

function clearAllTimers() {
  if (typingTimer) clearTimeout(typingTimer);
  if (corruptionTimer) clearInterval(corruptionTimer);
  typingTimer = null;
  corruptionTimer = null;
}

function safeGetElems() {
  const logBody = document.getElementById("logBody");
  const cursor = document.getElementById("cursor");

  if (!logBody || !cursor) {
    console.warn("[SigLost] logBody/cursor not found, skipped", { logBody, cursor });
    return null;
  }
  return { logBody, cursor };
}

function typeLine(state) {
  const { logBody, cursor } = state;

  if (lineIndex >= lines.length) return startCorruption(state);

  const line = lines[lineIndex++];
  const div = document.createElement("div");
  logBody.insertBefore(div, cursor);

  let charIndex = 0;

  const typeChar = () => {
    // logBodyがDOM差し替え等で消された時も死なないように
    if (!document.body.contains(logBody) || !document.body.contains(cursor)) {
      clearAllTimers();
      return;
    }

    if (charIndex < line.length) {
      div.textContent += line[charIndex++];
      logBody.scrollTop = logBody.scrollHeight;
      typingTimer = setTimeout(typeChar, 40 + Math.random() * 35);
    } else {
      typingTimer = setTimeout(() => typeLine(state), 150);
    }
  };

  typeChar();
}

function startCorruption(state) {
  const { logBody, cursor } = state;

  let count = 0;
  corruptionTimer = setInterval(() => {
    if (!document.body.contains(logBody) || !document.body.contains(cursor)) {
      clearAllTimers();
      return;
    }

    const div = document.createElement("div");
    div.textContent = "SIG LOST.";
    div.style.opacity = String(0.3 + Math.random() * 0.4);
    div.style.color = "#ff2b2b";
    logBody.insertBefore(div, cursor);
    logBody.scrollTop = logBody.scrollHeight;

    if (++count > 12) {
      clearInterval(corruptionTimer);
      corruptionTimer = null;
      typingTimer = setTimeout(() => restartTyping(state), 4000);
    }
  }, 100);
}

function restartTyping(state) {
  const { logBody, cursor } = state;
  lineIndex = 0;
  logBody.innerHTML = "";
  logBody.appendChild(cursor);
  typeLine(state);
}

// ✅ 外部から呼ぶ初期化
export function initSigLostLog() {
  const els = safeGetElems();
  if (!els) return;

  // 二重起動防止
  clearAllTimers();

  // 初回スタート
  lineIndex = 0;
  typeLine(els);
}

// ✅ 必要なら止める用
export function stopSigLostLog() {
  clearAllTimers();
}