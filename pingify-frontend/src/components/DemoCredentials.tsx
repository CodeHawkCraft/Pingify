import { Copy, Info } from "lucide-react";
import toast from "react-hot-toast";


export const DEMO_EMAIL = "ricahe3759@ofags.com";
export const DEMO_PASSWORD = "K2WajfTS6JVxhak";

export function DemoCredentials() {
  const copyPassword = () =>
    navigator.clipboard.writeText(DEMO_PASSWORD).then(() => toast.success("Password copied"));

  return (
    <div className="alert alert-info alert-soft mb-4 items-start text-sm text-left">
      <Info size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">Demo account</p>
        <p className="mt-1 opacity-75">The email is filled in. Paste this password when asked.</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1">
          <dt className="opacity-60">Email</dt>
          <dd className="font-mono">{DEMO_EMAIL}</dd>
          <dt className="opacity-60">Password</dt>
          <dd className="flex items-center gap-1 font-mono">
            {DEMO_PASSWORD}
            <button className="btn btn-ghost btn-xs" aria-label="Copy password" onClick={copyPassword}>
              <Copy size={14} />
            </button>
          </dd>
        </dl>
      </div>
    </div>
  );
}
