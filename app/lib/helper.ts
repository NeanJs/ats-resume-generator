export function removeNullChars(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/\u0000/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(removeNullChars);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, removeNullChars(v)]),
    );
  }

  return value;
}
