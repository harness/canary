/**
 * Open a URL in the system browser from the plugin UI iframe.
 *
 * `window.open` is the documented path, but Figma’s sandbox sometimes blocks it.
 * A same-gesture `<a target="_blank">` click is a reliable fallback.
 */
export function openExternalUrl(url: string): void {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (opened) return;

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
