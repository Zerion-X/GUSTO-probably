import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type RecipeCardProps = {
  id: number;
  image: string;
  name: string;
  summary: string;
  likes: number;
  saves: number;
};

export default function RecipeCard({
  id,
  image,
  name,
  summary,
  likes,
  saves,
}: RecipeCardProps) {
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(saves);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation();

    if (isSaved) {
      setSaveCount((count) => count - 1);
    } else {
      setSaveCount((count) => count + 1);
    }

    setIsSaved((prev) => !prev);
  }

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();

    if (isLiked) {
      setLikeCount((count) => count - 1);
    } else {
      setLikeCount((count) => count + 1);
    }

    setIsLiked((prev) => !prev);
  }

  return (
    <motion.article
      whileHover={{
        y: -10,
      }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/recipes/${id}`)}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/40 bg-white/30 shadow-2xl backdrop-blur-xl"
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          whileHover={{
            scale: 1.1,
          }}
          transition={{
            duration: 0.5,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Title on image */}
        <div className="absolute bottom-5 left-6">
          <h2
            className="text-4xl text-white drop-shadow-lg"
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            {name}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="leading-7 text-[#8B5A3C]">
          {summary}
        </p>

        <div className="mt-6 flex items-center justify-between">
          {/* Likes */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className="cursor-pointer text-[#C47A2C] transition hover:scale-110"
            >
              <Heart
                size={22}
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>

            <span className="font-medium text-[#C47A2C]">
              {likeCount}
            </span>
          </div>

          {/* Saves */}
          <div className="mx-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer text-[#C47A2C] transition hover:scale-110"
            >
              <Bookmark
                size={22}
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>

            <span className="font-medium text-[#C47A2C]">
              {saveCount}
            </span>
          </div>

          {/* Link text */}
          <span className="font-medium text-[#8B5A3C] transition duration-300 group-hover:text-[#C47A2C]">
            View →
          </span>
        </div>
      </div>
    </motion.article>
  );
}