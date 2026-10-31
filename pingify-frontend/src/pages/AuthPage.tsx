import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";
import { useSearchParams } from "react-router-dom";
import { DemoCredentials, DEMO_EMAIL } from "../components/DemoCredentials";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [searchParams] = useSearchParams();
  const [demo] = useState(() => mode === "login" && searchParams.has("demo"));

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        {demo && <DemoCredentials />}
        {mode === "login" ? (
          <SignIn path="/login" initialValues={demo ? { emailAddress: DEMO_EMAIL } : undefined} />
        ) : (
          <SignUp path="/signup" />
        )}
      </div>
    </div>
  );
}
