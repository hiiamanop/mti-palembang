const STORAGE_PREFIX = 'mti_preview_';

export function savePreviewDraft(key, data) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save preview draft to sessionStorage:', e);
  }
}

export function loadPreviewDraft(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load preview draft from sessionStorage:', e);
    return null;
  }
}

export function clearPreviewDraft(key) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (e) {
    console.warn('Failed to clear preview draft from sessionStorage:', e);
  }
}
