// js/main.js
import { onReady, safeInit } from "./core.js";
import { initTheme } from "./theme.js";
import { initBootLog } from "./bootlog.js";
import { initNodes } from "./nodes.js";
import { initSigLostLog } from "./siglost.js";

onReady(() => {
  safeInit("Theme", initTheme);
  safeInit("BootLog", initBootLog);
  safeInit("Nodes", initNodes);
  safeInit("SigLost", initSigLostLog);
});
safeInit("LoadingOverlay", () => {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;

  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => overlay.remove(), 800);
  }, 2000);
});
