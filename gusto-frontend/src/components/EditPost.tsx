import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, type RecipePost } from "../utils/postStorage";
import Addpost from "../pages/Post";

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState<RecipePost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    void (async () => {
      try {
        const recipePost = await getPostById(id);
        if (mounted) {
          setPost(recipePost);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA]">
        <p className="text-[#3A2419]">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-center">
        <div className="rounded-[28px] border border-white/40 bg-white/50 p-10 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-3 text-3xl text-[#3A2419]">Post not found</h1>
          <p className="text-[#8B5A3C]">The post could not be loaded. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Addpost
      type="edit"
      editImg={post.image}
      editTitle={post.title}
      editDes={post.description}
      editsteps={post.steps}
      editID={post.id}
    />
  );
}