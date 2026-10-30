import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? <Outlet /> : <Navigate to="/" replace />;
}

export function SignedOutRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? <Navigate to="/monitors" replace /> : <Outlet />;
}
