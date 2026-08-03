import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard, { type RecipeCardProps } from "../components/Recipe/RecipeCard";
import { API_BASE_URL } from "../utils/api";
import { getCurrentUser } from "../utils/userStorage";
import { getFavoritesByUser, getSavedByUser } from "../utils/postStorage";

type RecipeCollectionPageProps = {
  type: "favorites" | "saved";
};

export default function RecipeCollectionPage({
  type,
}: RecipeCollectionPageProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [items, setItems] = useState<RecipeCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const isFavorites = type === "favorites";
  const heading = isFavorites
    ? "Favorite Recipes & Posts"
    : "Saved Recipes & Posts";
  const emptyMessage = isFavorites
    ? "You have not liked any recipes or posts yet."
    : "You have not saved any recipes or posts yet.";

  useEffect(() => {
    let mounted = true;

    const fetchItems = async () => {
      if (!currentUser) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = isFavorites
          ? await getFavoritesByUser(currentUser.id)
          : await getSavedByUser(currentUser.id);

        if (!mounted) return;

        const mapped = data.map((r) => {
          const image = r.image
            ? r.image.startsWith("data:")
              ? r.image
              : r.image.startsWith("http")
              ? r.image
              : `${API_BASE_URL}${r.image}`
            : "";

          return {
            id: r.id,
            image,
            name: r.title,
            summary: r.description,
            likes: r.likes,
            saves: r.saves,
            kind: "recipe",
          } as RecipeCardProps;
        });

        setItems(mapped);
      } catch {
        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchItems();

    window.addEventListener("gusto-recipe-interactions-changed", fetchItems);

    return () => {
      mounted = false;
      window.removeEventListener("gusto-recipe-interactions-changed", fetchItems);
    };
  }, [currentUser?.id, isFavorites]);

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

        {loading ? (
          <div className="rounded-[28px] border border-white/40 bg-white/50 p-10 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-lg text-[#8B5A3C]">Loading your saved recipes...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[28px] border border-white/40 bg-white/50 p-10 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-lg text-[#8B5A3C]">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <RecipeCard key={item.id} {...item} kind="recipe" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}