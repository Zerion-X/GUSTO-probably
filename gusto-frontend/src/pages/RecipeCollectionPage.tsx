import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard from "../components/Recipe/RecipeCard";
import { recipes } from "../data/recipes";
import { getLikedItemIds, getSavedItemIds } from "../utils/recipeInteractions";
import { getCurrentUser } from "../utils/userStorage";
import { getPosts } from "../utils/postStorage";

type RecipeCollectionPageProps = {
  type: "favorites" | "saved";
};

export default function RecipeCollectionPage({
  type,
}: RecipeCollectionPageProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isFavorites = type === "favorites";

  const [recipeIds, setRecipeIds] = useState<number[]>(() =>
    isFavorites ? getLikedItemIds("recipe") : getSavedItemIds("recipe"),
  );
  const [postIds, setPostIds] = useState<number[]>(() =>
    isFavorites ? getLikedItemIds("post") : getSavedItemIds("post"),
  );

  useEffect(() => {
    const refreshIds = () => {
      setRecipeIds(
        isFavorites ? getLikedItemIds("recipe") : getSavedItemIds("recipe"),
      );
      setPostIds(
        isFavorites ? getLikedItemIds("post") : getSavedItemIds("post"),
      );
    };

    window.addEventListener("gusto-recipe-interactions-changed", refreshIds);
    window.addEventListener("gusto-posts-changed", refreshIds);

    return () => {
      window.removeEventListener("gusto-recipe-interactions-changed", refreshIds);
      window.removeEventListener("gusto-posts-changed", refreshIds);
    };
  }, [isFavorites]);

  const heading = isFavorites
    ? "Favorite Recipes & Posts"
    : "Saved Recipes & Posts";
  const emptyMessage = isFavorites
    ? "You have not liked any recipes or posts yet."
    : "You have not saved any recipes or posts yet.";

  const visibleRecipes = recipes.filter((recipe) =>
    recipeIds.includes(recipe.id),
  );
  const visiblePosts = getPosts().filter((post) => postIds.includes(post.id));
  const visibleItems = [...visibleRecipes, ...visiblePosts];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <button
          type="button"
          onClick={() =>
            navigate(currentUser ? `/profile/${currentUser.username}` : "/home")
          }
          className="mb-6 flex items-center gap-2 rounded-full border border-[#C47A2C]/30 bg-white/70 px-4 py-2 text-[#8B5A3C] transition hover:bg-white"
        >
          <ArrowLeft size={18} />
          Back to profile
        </button>

        <h1
          className="mb-8 text-5xl text-[#3A2419]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {heading}
        </h1>

        {visibleItems.length === 0 ? (
          <div className="rounded-[28px] border border-white/40 bg-white/50 p-10 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-lg text-[#8B5A3C]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={`recipe-${recipe.id}`}
                {...recipe}
                kind="recipe"
              />
            ))}
            {visiblePosts.map((post) => (
              <RecipeCard
                key={`post-${post.id}`}
                id={post.id}
                image={post.image}
                name={post.title}
                summary={post.description}
                likes={post.likes}
                saves={post.saves}
                kind="post"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}