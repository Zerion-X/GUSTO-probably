import { motion } from "framer-motion";
import { type ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
};

export default function GlassCard({ children }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full max-w-md rounded-[32px] border border-white/40 bg-white/30 p-10 shadow-2xl backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}