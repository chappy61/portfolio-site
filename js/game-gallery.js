import { onReady, safeInit } from "./global.js";

const TAB_META = {
  games: {
    title: "[ GAME_ARCHIVE.exe ]",
    code: "0x003EE",
    status: "Select an icon to launch.",
    // <br>はJS側で作るのが面倒なら、bodyは配列→<br>にするのがラク
    bodyLines: [
      "Module: Playable Prototypes",
      "Platform: JS / PWA",
      "Build: Experimental",
      "Focus: UX / Interaction / Playful Design",
    ],
  },
  study: {
    title: "[ STUDY_ARCHIVE.exe ]",
    code: "0x00A1B",
    status: "Open a project to inspect.",
    bodyLines: [
      "Module: Learning Apps",
      "Platform: Flask / PWA",
      "Build: Iterative",
      "Focus: Utility / Learning / Data",
    ],
  },
  works: {
    title: "[ WORKS_LOG.exe ]",
    code: "0x0BEEF",
    status: "Review case studies.",
    bodyLines: [
      "Module: Professional / Refactor",
      "Platform: Web / PWA",
      "Build: Production-minded",
      "Focus: UX / Maintainability",
    ],
  },
  life: {
    title: "[ LIFE_TOOLS.exe ]",
    code: "0x01IFE",
    status: "Utilities queue active.",
    bodyLines: [
      "Module: Daily Utilities",
      "Platform: Web App",
      "Build: Planned / Ongoing",
      "Focus: Speed / Accuracy / Ease",
    ],
  },
};

function setStatus(tabName) {
  const meta = TAB_META[tabName] || TAB_META.games;

  const titleEl = document.getElementById("statusTitle");
  const bodyEl = document.getElementById("statusBody");
  const codeEl = document.getElementById("statusCode");
  const statusEl = document.getElementById("statusStatus");

  if (titleEl) titleEl.textContent = meta.title;
  if (codeEl) codeEl.textContent = meta.code;
  if (statusEl) statusEl.textContent = meta.status;

  // bodyElは <div> の中に <br> がある構造なので、本文の部分だけ作り直す
  if (bodyEl) {
    // 既存のbodyを全部作り直す（br含めて一発）
    const linesHTML = meta.bodyLines.map(l => `${l}<br />`).join("");
    bodyEl.innerHTML = `
      ${linesHTML}
      Code:
      <code class="code-d" id="statusCode">${meta.code}</code>
      <br />
      Status:
      <span class="blink-d" id="statusStatus">${meta.status}</span>
    `;
  }
}

function setActiveTab(tabName) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach(btn => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  panels.forEach(p => {
    p.classList.toggle("is-active", p.dataset.panel === tabName);
  });

  setStatus(tabName);

  // URLのtabだけ更新（fromは保持）
  const url = new URL(location.href);
  url.searchParams.set("tab", tabName);
  history.replaceState(null, "", url.toString());
}

export function initGalleryTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const closeBtn = document.querySelector(".log-close");

  if (!tabButtons.length) return;

  // 初期タブ（?tab=study）
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "games";
  setActiveTab(initialTab);

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // ✖ボタン：from判定
  closeBtn?.addEventListener("click", () => {
    const from = params.get("from"); // "index" を想定
    if (from === "index") {
      location.href = "index.html";
      return;
    }
    if (history.length > 1) {
      history.back();
      return;
    }
    location.href = "index.html";
  });
}

onReady(() => {
  safeInit("GalleryTabs", initGalleryTabs);
});
