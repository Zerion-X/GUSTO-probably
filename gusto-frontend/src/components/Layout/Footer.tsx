import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#C47A2C]/10 bg-[#FFF8EA]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-8 py-6 md:flex-row">
        {/* Logo */}
        <Link to="/home" className="flex items-end gap-1 select-none">
          <span className="font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-[#8B5A3C] transition-colors duration-300 hover:text-[#C47A2C]">
            G
          </span>

          <span className="pb-1 text-lg uppercase tracking-[0.3em] text-[#6D4C41]">
            usto
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-sm text-[#6D4C41]">
          <Link
            to="/home"
            className="transition-colors duration-300 hover:text-[#C47A2C]"
          >
            Recipes
          </Link>

          {/* add contact us */}

        </div>
      </div>
      <div className="border-t border-[#C47A2C]/10 py-4 text-center text-sm text-[#8B5A3C]/70">
        © 2026 Gusto • Crafted with care.
      </div>
    </footer>
  );
}
