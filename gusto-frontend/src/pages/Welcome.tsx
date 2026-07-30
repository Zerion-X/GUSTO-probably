import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import AnimatedBackground from "../components/Layout/AnimatedBackground";

export default function Welcome() {
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.main
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8EA]"
    >
      <AnimatedBackground />

      {/* Huge Watermark */}
      <motion.h1
        style={{
          rotateX,
          rotateY,
        }}
        className="pointer-events-none absolute select-none text-[18vw] font-black uppercase tracking-[0.25em] text-[#8B5A3C]/5"
      >
        RECIPE
      </motion.h1>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center"
      >
        {/* Logo */}
        <motion.span
          className="mb-6 text-sm uppercase tracking-[0.8em] text-[#8B5A3C]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          GUSTO
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="mt-4 text-[4.5rem] font-normal leading-[0.95] tracking-tight text-[#3A2419] md:text-[6rem]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            textShadow: "0 8px 25px rgba(139,90,60,.06)",
          }}
        >
          Discover <span className="text-[#C47A2C]">Recipes</span>
          <br />
          Worth Remembering
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mt-10 max-w-md text-[18px] leading-9 font-light text-[#4D352B]/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
          }}
        >
          A curated collection of recipes crafted for people who enjoy cooking,
          exploring flavors, and creating memorable meals.
        </motion.p>

        {/* Button */}
        <motion.button
          onClick={() => navigate("/login")}
          className="
group
relative
mt-14
overflow-hidden
rounded-full
border
border-white/30
bg-white/10
backdrop-blur-xl
px-10
py-4
text-lg
font-medium
text-[#FFF8EA]
transition-all
duration-500
hover:-translate-y-1
hover:shadow-[0_0_45px_rgba(229,155,30,0.45)]
"
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1,
            type: "spring",
            stiffness: 150,
          }}
        >
          <span className="relative z-10">Enter the Kitchen</span>

          <div className="absolute inset-0 bg-linear-to-r from-[#8B5A3C] to-[#9A5B2E]" />

          <div className="absolute -left-full top-0 h-full w-full bg-white/20 transition-all duration-700 group-hover:left-full" />
        </motion.button>

        {/* Scroll Indicator */}
        <div className="absolute -bottom-36 flex flex-col items-center text-[#8B5A3C]/60">
          <span className="mb-3 text-xs uppercase tracking-[0.4em]">
            Explore
          </span>

          <div className="h-10 w-px bg-[#8B5A3C]/30" />
        </div>

        {/* Decorative SVG */}
        <div className="absolute -z-10 opacity-[0.06]">
          <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M70 20V120M55 20V80M85 20V80M70 120V240"
              stroke="#8B5A3C"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <path
              d="M180 20C180 55 165 70 165 95V240"
              stroke="#8B5A3C"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.section>
    </motion.main>
  );
}
