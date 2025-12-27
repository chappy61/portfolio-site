// js/core.js
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function onReady(fn) {
  document.addEventListener("DOMContentLoaded", fn, { once: true });
}

export function safeInit(name, fn) {
  try {
    fn();
  } catch (e) {
    console.warn(`[SKIP] ${name}: ${e?.message || e}`);
  }
}

/** 旧ID/新IDどっちでも拾う保険 */
export function getAnyById(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

/** datasetでページ判定（例：<body data-page="archive">） */
export function getPage() {
  return document.body?.dataset?.page || "";
}
