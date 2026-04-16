import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { useUser } from "./context/UserContext";
import { AddWebsiteForm } from "./components/AddWebsiteForm";
import { WebsitesPage } from "./pages/WebsitesPage";
import { WebsiteLogsPage } from "./pages/WebsiteLogsPage";

const App = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitors" element={<AddWebsiteForm />} />
          <Route path="/websites" element={<WebsitesPage />} />
          <Route path="/websites/:websiteId/logs" element={<WebsiteLogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
