import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "../validations/auth.validation";
import { signup } from "../api/auth.api";
import { useUser } from "../context/UserContext";
import type { SignupPayload } from "../types/auth.types";

export function Signup() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupPayload) => {
    try {
      setLoading(true);
      const user = await signup({
        username: data.username,
        password: data.password,
      });
      setUser(user);
      navigate("/");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm opacity-75">
            Sign up to get started with Pingify
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">Username</label>
            <input
              type="text"
              placeholder="e.g. john_doe"
              className={`input input-bordered w-full ${errors.username && "input-error"}`}
              {...register("username")}
            />
            {errors.username && (
              <span className="text-error text-xs">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              className={`input input-bordered w-full ${errors.password && "input-error"}`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-error text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-6 opacity-75">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="link link-primary font-semibold"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
