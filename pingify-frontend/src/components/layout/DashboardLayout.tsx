import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="md:hidden border-b px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
