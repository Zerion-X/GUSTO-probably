import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type PrimaryButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

export default function PrimaryButton({children, ...props}: PrimaryButtonProps) {
  return (
    <motion.button
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="
            group
            relative
            mt-4
            w-full
            overflow-hidden
            rounded-full
            border
            border-white/30
            bg-white/10
            py-4
            font-medium
            text-[#FFF8EA]
            backdrop-blur-xl
            transition-all
            duration-500
            hover:shadow-[0_0_45px_rgba(229,155,30,0.45)]
        "
        {...props}
        >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5A3C] to-[#9A5B2E]" />

        <div className="absolute -left-full top-0 h-full w-full bg-white/20 transition-all duration-700 group-hover:left-full" />

        <span className="relative z-10">{children}</span>
    </motion.button>
  );
}