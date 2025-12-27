// js/theme.js
export const ThemeManager = {
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
  },

  updateButtonGlow() {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    btn.classList.remove("mac-glow", "win-glow");
    btn.classList.add(this.currentTheme === "mac" ? "mac-glow" : "win-glow");
  }
};

export function initTheme() {
  ThemeManager.setTheme(localStorage.getItem("theme") || "win");

  const btn = document.getElementById("themeToggleBtn");
  btn?.addEventListener("click", () => ThemeManager.toggleTheme());
}