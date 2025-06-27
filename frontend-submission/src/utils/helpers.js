export function generateCode(length = 5) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

