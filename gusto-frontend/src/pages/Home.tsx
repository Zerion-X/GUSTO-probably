import { useEffect, useState } from "react";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard from "../components/Recipe/RecipeCard";
import { recipes } from "../data/recipes";
import { getPosts } from "../utils/postStorage";

export default function Home() {
  const [posts, setPosts] = useState(getPosts());

  useEffect(() => {
    const refreshPosts = () => setPosts(getPosts());

    window.addEventListener("gusto-posts-changed", refreshPosts);

    return () =>
      window.removeEventListener("gusto-posts-changed", refreshPosts);
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
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

          {recipes.map((recipe) => (
            <RecipeCard key={`recipe-${recipe.id}`} {...recipe} kind="recipe" />
          ))}
        </div>
      </main>
    </div>
  );
}
