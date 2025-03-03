// Generated theme index
export const availableThemes = [
  "Gitness-dark-standard",
  "Gitness-light-standard",
  "Harness-dark-standard",
  "Harness-light-standard"
];

export const defaultTheme = 'Gitness-dark-standard';

export function setTheme(themeName) {
  if (!availableThemes.includes(themeName)) {
    console.warn(`Theme ${themeName} not found. Using default theme ${defaultTheme}`);
    themeName = defaultTheme;
  }
  
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || defaultTheme;
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || defaultTheme);
}
