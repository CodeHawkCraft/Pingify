import { ClerkProvider } from "@clerk/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function ClerkProviderWithRouter({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/monitors"
      signUpFallbackRedirectUrl="/monitors"
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}
