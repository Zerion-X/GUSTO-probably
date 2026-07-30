import { type IFormField } from "../core/interfaces/IFormField";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}: IFormField) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-[#8B5A3C]">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          {...register(name)}
          className={`w-full rounded-xl border bg-white/60 px-4 pr-12 py-3 text-[#3A2419] placeholder:text-[#8B5A3C]/50 backdrop-blur-md outline-none transition-all duration-300 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-200"
              : "border-[#C47A2C]/20 focus:border-[#C47A2C] focus:ring-4 focus:ring-[#E59B1E]/20"
          }`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B5A3C]/70 hover:text-[#C47A2C] transition-colors duration-300"
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={2} />
            ) : (
              <Eye size={20} strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
