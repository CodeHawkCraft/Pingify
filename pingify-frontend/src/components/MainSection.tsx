import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

type Feature = {
  icon: string;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: "⏱",
    title: "Checks every 3 seconds",
    desc: "Continuous monitoring, 24/7.",
  },
  {
    icon: "📬",
    title: "Instant email alerts",
    desc: "Get notified the moment a site goes down.",
  },
  {
    icon: "🔗",
    title: "Any URL works",
    desc: "Paste a link and we handle the rest.",
  },
];

const FeatureCard = ({ icon, title, desc }: Feature) => (
  <div className="border rounded-lg p-4">
    <div className="text-xl mb-2">{icon}</div>
    <h3 className="text-sm mb-1">{title}</h3>
    <p className="text-xs text-primary opacity-70">{desc}</p>
  </div>
);

export const MainSection = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
      <h1 className="text-5xl font-bold mb-5 max-w-lg">
        Know when your <span className="text-primary">website goes down</span>
      </h1>
      <p className="text-lg max-w-md mb-10 opacity-75">
        Pingify monitors your websites every few seconds and sends you an email
        the moment something goes wrong.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        {user ? (
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
            Go to Dashboard
          </button>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="btn btn-primary">
              Start monitoring — it's free
            </button>
            <button onClick={() => navigate("/login")} className="btn btn-secondary">
              Log in
            </button>
          </>
        )}
      </div>

      <div className="w-full max-w-5xl mb-10">
        <p className="text-xs uppercase tracking-widest opacity-40 mb-3 font-semibold">
          See it in action
        </p>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-base-300">
          <video
            src="https://res.cloudinary.com/djqoudrj1/video/upload/v1776540237/pingify_xg4pfy.mp4"
            autoPlay
            muted
            loop
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </main>
  );
};
