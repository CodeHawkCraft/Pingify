import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute, SignedOutRoute } from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AddWebsiteForm } from "./components/AddWebsiteForm";
import { WebsitesPage } from "./pages/WebsitesPage";
import { WebsiteLogsPage } from "./pages/WebsiteLogsPage";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route element={<SignedOutRoute />}>
      <Route path="/login/*" element={<AuthPage mode="login" />} />
      <Route path="/signup/*" element={<AuthPage mode="signup" />} />
    </Route>

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

export default App;
