import { motion } from "framer-motion";

type ProfileStatProps = {
  title: string;
  value: number;
};

export default function ProfileStat({
  title,
  value,
}: ProfileStatProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
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
        text-center
        shadow-xl
        backdrop-blur-xl
      "
    >
      <h2 className="text-4xl font-bold text-[#C47A2C]">
        {value}
      </h2>

      <p className="mt-2 text-[#8B5A3C]">
        {title}
      </p>
    </motion.div>
  );
}