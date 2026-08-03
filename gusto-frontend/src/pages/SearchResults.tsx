import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard, { type RecipeCardProps } from "../components/Recipe/RecipeCard";
import { fetchRecipes, API_BASE_URL, type RecipeResponse } from "../utils/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([]);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const data: RecipeResponse[] = await fetchRecipes();

        if (!mounted) return;

        const mapped = data.map((r, idx) => {
          const image = r.imageData
            ? r.imageData.startsWith("data:")
              ? r.imageData
              : r.imageData.startsWith("http")
              ? r.imageData
              : `${API_BASE_URL}${r.imageData}`
            : "";

          return {
            id: r._id ?? String(idx + 1),
            image,
            name: r.name,
            summary: r.summary ?? r.description ?? "",
            likes: r.likes ?? 0,
            saves: r.saves ?? 0,
          } as RecipeCardProps;
        });

        setRecipes(mapped);
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const allItems = useMemo(
    () => recipes.map((recipe) => ({ ...recipe, kind: "recipe" as const })),
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    if (!query) return [];

    return allItems.filter((item) =>
      [item.name].join(" ").toLowerCase().includes(query.toLowerCase()),
    );
  }, [allItems, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-8 py-12">
        {query ? (
          filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={`${recipe.kind}-${recipe.id}`} {...recipe} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#C47A2C]/20 bg-white/80 p-12 text-center shadow-2xl backdrop-blur-xl">
              <p className="text-xl font-semibold text-[#8B5A3C]">
                No recipes found
              </p>
              <p className="mt-3 text-[#6D4C41]/90">
                Try a different keyword or broaden your search to find recipes
                that match.
              </p>
            </div>
          )
        ) : (
          <div className="rounded-[28px] border border-[#C47A2C]/20 bg-white/80 p-12 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xl font-semibold text-[#8B5A3C]">
              Ready to search?
            </p>
            <p className="mt-3 text-[#6D4C41]/90">
              Use the search bar above to explore recipes, ingredients, and
              cuisine ideas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}