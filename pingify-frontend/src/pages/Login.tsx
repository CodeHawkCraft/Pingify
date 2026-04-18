import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../validations/auth.validation";
import { login } from "../api/auth.api";
import { useUser } from "../context/UserContext";
import { AuthForm } from "../components/AuthForm";
import type { AuthPayload } from "../types/auth.types";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: AuthPayload) => {
    try {
      setLoading(true);
      const user = await login({
        username: data.username,
        password: data.password,
      });
      setUser(user);
      navigate("/monitors");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-sm opacity-75">Log in to your Pingify account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <AuthForm form={register} errors={errors} />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="text-center text-sm opacity-75">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="link link-primary font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
