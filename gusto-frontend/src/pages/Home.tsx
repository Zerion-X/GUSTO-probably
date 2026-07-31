import { useEffect, useState } from "react";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard, {type RecipeCardProps, } from "../components/Recipe/RecipeCard";
import img1 from "../assets/hero.png";


type RecipeResponse = {
  _id?: string;
  name: string;
  summary?: string;
  likes?: number;
  saves?: number;
  imageURL?: string;
};

const fallbackImages = [img1];

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch("http://localhost:1789/api/recipes");

        if (!response.ok) {
          throw new Error("Unable to load recipes");
        }

        const data: RecipeResponse[] = await response.json();

        const mappedRecipes: RecipeCardProps[] = data.map((recipe, index) => ({
          id: recipe._id ?? String(index + 1),
          image: recipe.imageURL ? `http://localhost:1789${recipe.imageURL}` : fallbackImages[index % fallbackImages.length],
          name: recipe.name,
          summary: recipe.summary ?? "A delicious recipe to try.",
          likes: recipe.likes ?? 0,
          saves: recipe.saves ?? 0,
        }));

        setRecipes(mappedRecipes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    void loadRecipes();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-8 py-12">
        <h1
          className="mb-10 text-6xl text-[#3A2419]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Recipes
        </h1>

        {loading && <p className="text-[#8B5A3C]">Loading recipes...</p>}
        {error && <p className="text-[#C47A2C]">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="text-[#8B5A3C]">No recipes available right now.</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
            />
          ))}
        </div>
      </main>
    </div>
  );
}