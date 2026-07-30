import { motion } from "framer-motion";

type ProfileHeaderProps = {
    username: string;
    email: string;
    avatar?: string;
};

export default function ProfileHeader({
    username,
    email,
    avatar,
}: ProfileHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 flex flex-col items-center text-center"
    >
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="mb-5 h-28 w-28 rounded-full border-4 border-white/40 object-cover shadow-xl"
        />
      ) : (
        <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/40 bg-gradient-to-br from-[#C47A2C] to-[#8B5A3C] text-4xl font-bold text-white shadow-xl">
          {username.charAt(0).toUpperCase()}
        </div>
      )}

      <h1
        className="text-5xl text-[#3A2419]"
        style={{
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {username}
      </h1>

      <p className="mt-2 text-[#8B5A3C]">
        {email}
      </p>
    </motion.section>
  );
}