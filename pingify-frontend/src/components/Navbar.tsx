import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="px-8 py-4 flex items-center bg-base-100 justify-between border-b sticky top-0 z-10 backdrop-blur-sm">
      <button
        onClick={() => navigate("/")}
        className="text-base font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity"
      >
        Pingify
      </button>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="btn btn-secondary btn-sm"
        >
          Log in
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="btn btn-primary btn-sm"
        >
          Get started
        </button>
      </div>
    </nav>
  );
};
