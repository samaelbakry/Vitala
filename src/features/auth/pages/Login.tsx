import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../type";
import { signIn } from "../services/authService";
import { setSession } from "../authSlice";

import { toast } from "sonner";
import { useAppDispatch } from "../../../app/store";

const inputClass =
  "w-full border-0 border-b-2 border-[#D3DEDB] bg-transparent px-0 py-3 text-base text-[#0E2A2B] placeholder:text-[#8FA5A2] outline-none transition-colors focus:border-[#0E2A2B] focus-visible:border-[#0E2A2B]";
const labelClass = "block text-sm font-medium text-[#0E2A2B]";
const errorClass = "mt-1.5 text-sm text-[#B42318]";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);

      const data = await signIn(values.email, values.password);

      dispatch(setSession(data.session));
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="auth-display text-4xl font-bold text-[#0E2A2B]">
        Welcome back
      </h1>
      <p className="mt-3 text-[#5B7270]">Sign in to manage your clinic.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-7" noValidate>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="doctor@example.com"
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#0F6B5C] underline-offset-4 hover:underline focus-visible:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-1 text-[#5B7270] hover:text-[#0E2A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F6B5C]"
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#0E2A2B] py-3.5 font-semibold text-white transition-colors hover:bg-[#143d3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B5C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#5B7270]">
        New to Vitala?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#0F6B5C] underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}