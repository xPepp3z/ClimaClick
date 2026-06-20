import type { GeoLocation } from "../types/weather";

const STORAGE_KEY = "climaclick:favorites";

export function getFavorites(): GeoLocation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as GeoLocation[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function isFavorite(location: GeoLocation) {
  return getFavorites().some((item) => item.id === location.id);
}

export function toggleFavorite(location: GeoLocation) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === location.id);
  const next = exists
    ? favorites.filter((item) => item.id !== location.id)
    : [location, ...favorites].slice(0, 8);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
