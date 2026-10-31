import { useState } from "react";
import { useSignIn } from "@clerk/react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./DemoCredentials";

export function TryDemoButton() {
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  // Signs straight into the shared demo account; if Clerk asks for an extra step
  // (e.g. new-device verification), fall back to the login page with the credentials shown.
  const startDemo = async () => {
    setSigningIn(true);
    const { error } = await signIn.password({ emailAddress: DEMO_EMAIL, password: DEMO_PASSWORD });
    if (!error && signIn.status === "complete") {
      await signIn.finalize({ navigate: () => navigate("/monitors") });
    } else {
      navigate("/login?demo");
    }
    setSigningIn(false);
  };

  return (
    <button
      onClick={startDemo}
      disabled={signingIn}
      className="group btn btn-primary btn-lg relative shadow-lg shadow-primary/40 ring-4 ring-primary/20 hover:scale-105 transition-transform motion-reduce:hover:scale-100"
    >
      {/* Pulsing "live" dot to pull the eye */}
      <span className="absolute -top-1 -right-1 flex size-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping motion-reduce:animate-none" />
        <span className="relative inline-flex size-3 rounded-full bg-success" />
      </span>
      {signingIn ? <span className="loading loading-spinner loading-sm" /> : <PlayCircle size={20} />}
      Try Live Demo
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
    </button>
  );
}
