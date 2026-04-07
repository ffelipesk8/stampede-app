export function decodeMojibake(value: string): string {
  const trimmed = value.trim();

  if (!/[ÃÂâ]/.test(trimmed)) return trimmed;

  try {
    return Buffer.from(trimmed, "latin1").toString("utf8");
  } catch {
    return trimmed;
  }
}

export function normalizeEntityName(value: string): string {
  const decoded = decodeMojibake(value);

  return decoded
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizedLookup<T extends string>(record: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [normalizeEntityName(key), value])
  ) as Record<string, T>;
}
