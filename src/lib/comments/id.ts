const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function createId(size = 12): string {
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    let out = "";
    for (let i = 0; i < size; i++) {
      out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return out;
  }
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < size; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}
