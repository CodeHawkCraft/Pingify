import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ClerkProviderWithRouter } from "./components/ClerkProviderWithRouter.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRouter>
        <App />
        <Toaster />
      </ClerkProviderWithRouter>
    </BrowserRouter>
  </StrictMode>,
);
