import type { Thinker } from "@/types";

const CUSTOM_THINKERS_KEY = "council-custom-thinkers";

export function getCustomThinkers(): Thinker[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CUSTOM_THINKERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomThinker(thinker: Thinker): void {
  const existing = getCustomThinkers();
  const updated = [...existing.filter((t) => t.id !== thinker.id), thinker];
  localStorage.setItem(CUSTOM_THINKERS_KEY, JSON.stringify(updated));
}

export function removeCustomThinker(thinkerId: string): void {
  const existing = getCustomThinkers();
  const updated = existing.filter((t) => t.id !== thinkerId);
  localStorage.setItem(CUSTOM_THINKERS_KEY, JSON.stringify(updated));
}
