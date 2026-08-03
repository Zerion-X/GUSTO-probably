import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema } from "../validation/Validation";
import FormField from "../components/FormField";
import AnimatedBackground from "../components/Layout/AnimatedBackground";
import GlassCard from "../components/ui/GlassCard";
import AuthHeader from "../components/ui/AuthHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import { loginUser, setCurrentUser } from "../utils/userStorage";


type LoginFormData = {
  email_username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    const user = loginUser(data.email_username, data.password);

  if (!user) {
    setAuthError("Invalid username/email or password.");
    return;
  }

    setCurrentUser(user);

    navigate("/home");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8EA] px-6">
      <AnimatedBackground />

      <GlassCard>
        <AuthHeader
          title="Welcome"
          highlight="Back"
          description="Sign in and continue discovering delicious recipes."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
        {authError && (
          <div className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-red-700">
            {authError}
          </div>
        )}
          
          <FormField
            label="Email or Username"
            name="email_username"
            placeholder="Enter your email or username"
            register={register}
            error={errors.email_username}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password}
          />

          <PrimaryButton type="submit">Login</PrimaryButton>
        </form>

        <p className="mt-8 text-center text-sm text-[#8B5A3C]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#C47A2C] transition hover:text-[#E59B1E]"
          >
            Create one
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
