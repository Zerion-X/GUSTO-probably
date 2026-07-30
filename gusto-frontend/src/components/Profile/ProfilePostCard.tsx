import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type PostCardProps = {
  title: string;
  description: string;
  likes: number;
  createdAt: string;
};

export default function PostCard({
  title,
  description,
  likes,
  createdAt,
}: PostCardProps) {
  return (
    <motion.article
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        rounded-3xl
        border
        border-white/40
        bg-white/30
        p-6
        shadow-xl
        backdrop-blur-xl
      "
    >
      <h3 className="text-2xl font-semibold text-[#3A2419]">
        {title}
      </h3>

      <p className="mt-3 text-[#8B5A3C]">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-6 text-sm text-[#8B5A3C]/80">
        <span><Heart /> {likes}</span>

        <span className="ml-auto">
          {createdAt}
        </span>
      </div>
    </motion.article>
  );
}