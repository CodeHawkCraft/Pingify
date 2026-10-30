import { SignIn, SignUp } from "@clerk/react";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="h-screen flex items-center justify-center">
      {mode === "login" ? <SignIn path="/login" /> : <SignUp path="/signup" />}
    </div>
  );
}
