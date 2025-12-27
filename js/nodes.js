// js/nodes.js
export function initNodes() {
  const icons = document.querySelectorAll(".icon, .game-icon");
  if (!icons.length) return;

  icons.forEach(icon => {
    icon.addEventListener("click", () => {
      console.log("icon clicked:", icon.id);
    });
  });
}
