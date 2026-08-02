import { getCurrentUser } from "./userStorage";

const STORAGE_KEY = "gusto-recipe-interactions";

type InteractionTarget = "recipe" | "post";

type InteractionState = {
  likedItemKeys: string[];
  savedItemKeys: string[];
};

type UserInteractionsMap = Record<string, InteractionState>;

function getUserKey() {
  return getCurrentUser()?.username ?? "guest";
}

function normalizeInteractions(raw: unknown): InteractionState {
  if (!raw || typeof raw !== "object") {
    return { likedItemKeys: [], savedItemKeys: [] };
  }

  const parsed = raw as Record<string, unknown>;
  const likedItemKeys = Array.isArray(parsed.likedItemKeys)
    ? parsed.likedItemKeys.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const savedItemKeys = Array.isArray(parsed.savedItemKeys)
    ? parsed.savedItemKeys.filter(
        (value): value is string => typeof value === "string",
      )
    : [];

  return { likedItemKeys, savedItemKeys };
}

function readInteractions(): InteractionState {
  if (typeof window === "undefined") {
    return { likedItemKeys: [], savedItemKeys: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { likedItemKeys: [], savedItemKeys: [] };
    }

    const parsed = JSON.parse(raw) as UserInteractionsMap;
    const userKey = getUserKey();

    return normalizeInteractions(parsed[userKey]);
  } catch {
    return { likedItemKeys: [], savedItemKeys: [] };
  }
}

function writeInteractions(interactions: InteractionState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: UserInteractionsMap = raw ? JSON.parse(raw) : {};
    parsed[getUserKey()] = interactions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore storage write errors in this demo app.
  }
}

function getItemKey(target: InteractionTarget, itemId: number) {
  return `${target}:${itemId}`;
}

export function isItemLiked(target: InteractionTarget, itemId: number) {
  return readInteractions().likedItemKeys.includes(getItemKey(target, itemId));
}

export function isItemSaved(target: InteractionTarget, itemId: number) {
  return readInteractions().savedItemKeys.includes(getItemKey(target, itemId));
}

export function getLikedItemIds(target: InteractionTarget) {
  return readInteractions()
    .likedItemKeys.filter((key) => key.startsWith(`${target}:`))
    .map((key) => Number(key.split(":")[1]));
}

export function getSavedItemIds(target: InteractionTarget) {
  return readInteractions()
    .savedItemKeys.filter((key) => key.startsWith(`${target}:`))
    .map((key) => Number(key.split(":")[1]));
}

export function isRecipeLiked(recipeId: number) {
  return isItemLiked("recipe", recipeId);
}

export function isRecipeSaved(recipeId: number) {
  return isItemSaved("recipe", recipeId);
}

export function getLikedRecipeIds() {
  return getLikedItemIds("recipe");
}

export function getSavedRecipeIds() {
  return getSavedItemIds("recipe");
}

export function toggleItemLike(target: InteractionTarget, itemId: number) {
  const interactions = readInteractions();
  const itemKey = getItemKey(target, itemId);
  const isLiked = interactions.likedItemKeys.includes(itemKey);

  if (isLiked) {
    interactions.likedItemKeys = interactions.likedItemKeys.filter(
      (key) => key !== itemKey,
    );
  } else {
    interactions.likedItemKeys = [...interactions.likedItemKeys, itemKey];
  }

  writeInteractions(interactions);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("gusto-recipe-interactions-changed"));
  }

  return !isLiked;
}

export function toggleItemSave(target: InteractionTarget, itemId: number) {
  const interactions = readInteractions();
  const itemKey = getItemKey(target, itemId);
  const isSaved = interactions.savedItemKeys.includes(itemKey);

  if (isSaved) {
    interactions.savedItemKeys = interactions.savedItemKeys.filter(
      (key) => key !== itemKey,
    );
  } else {
    interactions.savedItemKeys = [...interactions.savedItemKeys, itemKey];
  }

  writeInteractions(interactions);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("gusto-recipe-interactions-changed"));
  }

  return !isSaved;
}

export function toggleRecipeLike(recipeId: number) {
  return toggleItemLike("recipe", recipeId);
}

export function toggleRecipeSave(recipeId: number) {
  return toggleItemSave("recipe", recipeId);
}
