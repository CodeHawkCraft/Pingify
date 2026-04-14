import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AuthPayload } from "../types/auth.types";

type AuthFormProps = {
  form: UseFormRegister<AuthPayload>;
  errors: FieldErrors<AuthPayload>;
};

export function AuthForm({ form, errors }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Username</label>
        <input
          type="text"
          placeholder="e.g. john_doe"
          className={`input input-bordered w-full ${errors.username && "input-error"}`}
          {...form("username")}
        />
        {errors.username && (
          <span className="text-error text-xs">{errors.username.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 characters"
            className={`input input-bordered w-full ${errors.password && "input-error"}`}
            {...form("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-error text-xs">{errors.password.message}</span>
        )}
      </div>
    </div>
  );
}
