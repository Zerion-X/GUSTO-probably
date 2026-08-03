import { getCurrentUser } from "./userStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:1789";

export interface RecipePost {
  id: string;
  author: string;
  title: string;
  description: string;
  steps: string[];
  image: string;
  createdAt: string;
  likes: number;
  saves: number;
}

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const data = await res.json();
  return data.csrfToken;
}

let cachedCsrfToken: string | null = null;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const isSafe = ["GET", "HEAD", "OPTIONS"].includes(method);

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  async function doFetch(token?: string) {
    if (token) headers.set("x-csrf-token", token);

    const res = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return res.json() as Promise<T>;
  }

  if (isSafe) {
    return doFetch();
  }

  if (!cachedCsrfToken) {
    cachedCsrfToken = await fetchCsrfToken();
  }

  try {
    return await doFetch(cachedCsrfToken);
  } catch (err: any) {
    if (err?.message?.includes("CSRF") || err?.message?.includes("Forbidden")) {
      cachedCsrfToken = await fetchCsrfToken();
      return await doFetch(cachedCsrfToken);
    }
    throw err;
  }
}

function mapRecipeToPost(recipe: any): RecipePost {
  return {
    id: recipe._id,
    author: recipe.author?.name ?? recipe.author ?? "",
    title: recipe.name,
    description: recipe.summary ?? recipe.description ?? "",
    steps: recipe.steps ?? [],
    image: recipe.imageData ?? "",
    createdAt: recipe.createdAt ?? "",
    likes: recipe.likes ?? 0,
    saves: recipe.saves ?? 0,
  };
}

export async function getPostById(
  id: string | number | undefined,
): Promise<RecipePost | null> {
  if (!id) return null;
  const recipe = await request<any>(`/api/recipes/${id}`);
  return mapRecipeToPost(recipe);
}

function getProfileId(): string | undefined {
  return getCurrentUser()?.profileId ?? getCurrentUser()?.id;
}

export async function getPostsByUser(
  userId: string,
): Promise<RecipePost[]> {
  const profileId = userId || getProfileId();
  if (!profileId) return [];
  const recipes = await request<any[]>(`/api/profiles/${profileId}/posts`);
  return recipes.map(mapRecipeToPost);
}

export async function getFavoritesByUser(
  userId: string,
): Promise<RecipePost[]> {
  const profileId = userId || getProfileId();
  if (!profileId) return [];
  const recipes = await request<any[]>(`/api/profiles/${profileId}/favorites`);
  return recipes.map(mapRecipeToPost);
}

export async function getSavedByUser(
  userId: string,
): Promise<RecipePost[]> {
  const profileId = userId || getProfileId();
  if (!profileId) return [];
  const recipes = await request<any[]>(`/api/profiles/${profileId}/saved`);
  return recipes.map(mapRecipeToPost);
}

export async function getProfile(
  userId: string,
): Promise<{ favorites: any[]; saved: any[]; posts: any[] }> {
  const profileId = userId || getProfileId();
  if (!profileId) return { favorites: [], saved: [], posts: [] };
  return await request<any>(`/api/profiles/${profileId}`);
}

export async function addPost(
  post: Omit<RecipePost, "id" | "author" | "createdAt" | "likes" | "saves">,
): Promise<RecipePost | undefined> {
  const currentUser = getCurrentUser();
  if (!currentUser) return undefined;

  const profileId = currentUser.profileId ?? currentUser.id;

  const created = await request<any>("/api/recipes", {
    method: "POST",
    body: JSON.stringify({
      name: post.title,
      summary: post.description,
      steps: post.steps,
      imageData: post.image,
    }),
  });

  await request(`/api/profiles/${profileId}/posts`, {
    method: "PATCH",
    body: JSON.stringify({ recipeId: created._id }),
  });

  return mapRecipeToPost(created);
}

export async function updatePost(
  postId: string,
  updatedFields: Partial<Omit<RecipePost, "id" | "author" | "createdAt" | "likes" | "saves">>,
): Promise<RecipePost | undefined> {
  const updated = await request<any>(`/api/recipes/${postId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: updatedFields.title,
      summary: updatedFields.description,
      steps: updatedFields.steps,
      imageData: updatedFields.image,
    }),
  });

  return mapRecipeToPost(updated);
}

export async function deletePost(postId: string): Promise<boolean> {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const profileId = currentUser.profileId ?? currentUser.id;

  await request(`/api/recipes/${postId}`, {
    method: "DELETE",
  });

  await request(`/api/profiles/${profileId}/posts`, {
    method: "DELETE",
    body: JSON.stringify({ recipeId: postId }),
  });

  return true;
}

export async function updatePostInteraction(
  postId: string | number,
  field: "likes" | "saves",
  add: boolean,
): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const profileId = currentUser.profileId ?? currentUser.id;
  const path =
    field === "likes"
      ? `/api/profiles/${profileId}/favorites`
      : `/api/profiles/${profileId}/saved`;

  await request(path, {
    method: add ? "PATCH" : "DELETE",
    body: JSON.stringify({ recipeId: String(postId) }),
  });
}