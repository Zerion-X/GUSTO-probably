import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard from "../components/Recipe/RecipeCard";
import { getPosts } from "../utils/postStorage";
import img1 from "../assets/images (3).jpg";
import img2 from "../assets/images (1).jpg";
import img3 from "../assets/images (2).jpg";
import img4 from "../assets/images (4).jpg";
import img5 from "../assets/images (5).jpg";
import img6 from "../assets/images.jpg";

const recipes = [
  {
    id: 1,
    image: img1,
    name: "Classic Pizza",
    summary: "Traditional Italian pizza with mozzarella, basil and tomato sauce.",
    likes: 22,
    saves: 32,
  },
  {
    id: 2,
    image: img2,
    name: "Cheese Burger",
    summary: "Juicy homemade burger served with cheddar cheese and crispy fries.",
    likes: 41,
    saves: 36,
  },
  {
    id: 3,
    image: img3,
    name: "Creamy Pasta",
    summary: "Creamy Alfredo pasta with grilled chicken and parmesan.",
    likes: 51,
    saves: 19,
  },
  {
    id: 4,
    image: img6,
    name: "Pepperoni Pizza",
    summary: "A crispy pizza topped with pepperoni and mozzarella cheese.",
    likes: 64,
    saves: 28,
  },
  {
    id: 5,
    image: img4,
    name: "Double Burger",
    summary: "Two juicy beef patties with cheddar and caramelized onions.",
    likes: 38,
    saves: 15,
  },
  {
    id: 6,
    image: img5,
    name: "Carbonara",
    summary: "Classic Roman pasta with egg, pecorino and pancetta.",
    likes: 73,
    saves: 44,
  },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [posts, setPosts] = useState(() => getPosts());

  useEffect(() => {
    const refresh = () => setPosts(getPosts());
    window.addEventListener("gusto-posts-changed", refresh);
    return () => window.removeEventListener("gusto-posts-changed", refresh);
  }, []);

  const allItems = useMemo(
    () => [
      ...recipes.map((recipe) => ({ ...recipe, kind: "recipe" as const })),
      ...posts.map((post) => ({
        id: post.id,
        image: post.image,
        name: post.title,
        summary: post.description,
        likes: post.likes,
        saves: post.saves,
        kind: "post" as const,
      })),
    ],
    [posts],
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