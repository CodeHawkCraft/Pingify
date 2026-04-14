import { Menu, X } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  return (
    <div
      className={`bg-base-200 h-full shrink-0  flex flex-col items-center p-4 transition-all duration-300 max-md:fixed max-md:z-30 ${
        open ? "w-[200px]" : "w-[60px] max-md:-translate-x-full"
      }`}
    >
      <button onClick={onToggle} className="pr-4">
        {open ? <X /> : <Menu />}
      </button>
    </div>
  );
};

export default Sidebar;
