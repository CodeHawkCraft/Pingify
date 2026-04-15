import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 border-b bg-base-200 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="btn">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">Pingify</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
