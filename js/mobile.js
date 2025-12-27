// mobile.js
// ==========================
// スマホ用（partial注入後に呼ぶ）
// ==========================

let mobileInitialized = false;

export function initMobileUI() {
  // 二重バインド防止（safeInit＋再呼び出し対策）
  if (mobileInitialized) return;
  mobileInitialized = true;

  const mobileUI = document.getElementById("mobileHomeUI");
  const content = document.querySelector(".content");

  const gameIcon = document.getElementById("mobileGameIcon");
  const sheet = document.getElementById("gameFolderSheet");
  const closeBtn = document.getElementById("closeGameFolder");
  const homeContent = document.getElementById("homeContent");

  // partialがまだ入ってない等で要素がないなら、初期化を諦めて解除
  // （※必要なら再実行できるようにするなら false に戻す）
  if (!mobileUI || !content) {
    mobileInitialized = false;
    return;
  }

  // --- モバイルUI表示切替 ---
  function updateMobileUI() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      mobileUI.classList.remove("hidden");
      content.style.display = "none";
    } else {
      mobileUI.classList.add("hidden");
      content.style.display = "block";
    }
  }
  updateMobileUI();
  window.addEventListener("resize", updateMobileUI);

  // --- 時計 ---
  const updateClock = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const timeEl = document.getElementById("mobileTime");
    if (timeEl) timeEl.textContent = `${h}:${m}`;
  };
  updateClock();
  setInterval(updateClock, 10000);

  // --- フォルダ開閉 ---
  gameIcon?.addEventListener("click", () => {
    sheet?.classList.remove("hidden");
    homeContent?.classList.add("is-blurred");
  });

  closeBtn?.addEventListener("click", () => {
    sheet?.classList.add("hidden");
    homeContent?.classList.remove("is-blurred");
  });

  // --- 背景タップで閉じる ---
  const overlay = document.getElementById("overlayLayer");
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      sheet?.classList.add("hidden");
      homeContent?.classList.remove("is-blurred");
    }
  });

  // --- アプリイベント例 ---
  document.getElementById("mobileQuotIcon")?.addEventListener("click", () => {
    window.location.href = "https://quotdict.onrender.com";
  });

  // --- カレンダー ---
  const calEl = document.getElementById("calendarWidget");
  if (calEl) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekday = today.toLocaleDateString("ja-JP", { weekday: "long" });
    const weekdayVertical = weekday.split("").map(c => `<div>${c}</div>`).join("");

    calEl.innerHTML = `
      <div class="calendar-header">${year}年${month}月</div>
      <div class="calendar-main">
        <div class="calendar-day">${day}</div>
        <div class="calendar-weekday">${weekdayVertical}</div>
      </div>
    `;
  }
}
