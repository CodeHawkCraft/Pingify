import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AuthPayload } from "../types/auth.types";

type AuthFormProps = {
  form: UseFormRegister<AuthPayload>;
  errors: FieldErrors<AuthPayload>;
};

export function AuthForm({ form, errors }: AuthFormProps) {
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
        <input
          type="password"
          placeholder="Min. 6 characters"
          className={`input input-bordered w-full ${errors.password && "input-error"}`}
          {...form("password")}
        />
        {errors.password && (
          <span className="text-error text-xs">{errors.password.message}</span>
        )}
      </div>
    </div>
  );
}
