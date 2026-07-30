import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/Layout/AnimatedBackground";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      {/* Watermark */}
      <h1 className="pointer-events-none absolute select-none text-[22vw] font-black tracking-[0.2em] text-[#8B5A3C]/5">
        404
      </h1>

      <motion.section
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center"
      >
        <span className="text-sm uppercase tracking-[0.8em] text-[#8B5A3C]">
          GUSTO
        </span>

        <h2
          className="mt-6 text-6xl leading-tight text-[#3A2419]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Lost in the Kitchen?
        </h2>

        <p className="mt-6 max-w-lg text-lg leading-8 text-[#4D352B]/80">
          The recipe you're looking for couldn't be found. It may have been
          moved, deleted, or the address might be incorrect.
        </p>

        <motion.button
          onClick={() => navigate("/home")}
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

          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5A3C] to-[#9A5B2E]" />

          <div className="absolute -left-full top-0 h-full w-full bg-white/20 transition-all duration-700 group-hover:left-full" />
        </motion.button>
      </motion.section>
    </main>
  );
}
