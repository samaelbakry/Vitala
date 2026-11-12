
import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { resetPassword } from "../services/authService";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      await resetPassword(values.email);

      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-slate-900">
        Forgot password?
      </h1>

      <p className="mt-2 mb-8 text-slate-500">
        Enter your email and we'll send you a password reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email address
          </label>

          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-lg bg-teal-700 py-3 font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-6 block text-center text-sm text-teal-700"
      >
        Back to login
      </Link>
    </div>
  );
}
