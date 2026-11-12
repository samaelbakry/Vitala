import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormValues } from "../type";
import { signUp } from "../services/authService";
import { setSession } from "../authSlice";

import { toast } from "sonner";
import { useAppDispatch } from "../../../app/store";

const inputClass =
  "w-full border-0 border-b-2 border-[#D3DEDB] bg-transparent px-0 py-3 text-base text-[#0E2A2B] placeholder:text-[#8FA5A2] outline-none transition-colors focus:border-[#0E2A2B] focus-visible:border-[#0E2A2B]";
const labelClass = "block text-sm font-medium text-[#0E2A2B]";
const errorClass = "mt-1.5 text-sm text-[#B42318]";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);

      const data = await signUp(values.fullName, values.email, values.password);

      if (data.session) {
        dispatch(setSession(data.session));
        toast.success("Account created successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success(
          "Account created! Please check your email to verify your account.",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className="w-full max-w-md">
      <h1 className="auth-display text-4xl font-bold text-[#0E2A2B]">
        Create your account
      </h1>
      <p className="mt-3 text-[#5B7270]">
        Set up Vitala for your clinic in a minute.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={!!errors.fullName}
            className={inputClass}
          />
          {errors.fullName && (
            <p className={errorClass}>{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={passwordType}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-1 text-[#5B7270] hover:text-[#0E2A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F6B5C]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              {...register("confirmPassword")}
              type={passwordType}
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={!!errors.confirmPassword}
              className={inputClass}
            />
            {errors.confirmPassword && (
              <p className={errorClass}>{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#0E2A2B] py-3.5 font-semibold text-white transition-colors hover:bg-[#143d3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B5C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#5B7270]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#0F6B5C] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}