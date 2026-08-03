const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1789";

export type RecipeResponse = {
  _id?: string;
  name: string;
  summary?: string;
  likes?: number;
  saves?: number;
  imageData?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  author?: string;
  time?: string;
  difficulty?: string;
};

export async function fetchRecipes(): Promise<RecipeResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/recipes`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return (await res.json()) as RecipeResponse[];
}

export async function fetchRecipeById(id: string): Promise<RecipeResponse | null> {
  const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return (await res.json()) as RecipeResponse;
}

export { API_BASE_URL };
