import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ProfileStatProps = {
  title: string;
  value: number;
  route?: string;
};

export default function ProfileStat({ title, value, route }: ProfileStatProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
      onClick={() => route && navigate(route)}
      className="
        rounded-3xl
        border
        border-white/40
        bg-white/30
        p-6
        text-center
        shadow-xl
        backdrop-blur-xl
        transition
        hover:bg-white/50
      "
    >
      <h2 className="text-4xl font-bold text-[#C47A2C]">{value}</h2>

      <p className="mt-2 text-[#8B5A3C]">{title}</p>
    </motion.button>
  );
}