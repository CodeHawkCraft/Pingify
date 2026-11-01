import { Activity, ArrowLeft, Bell, Globe } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { WebsiteLogs } from "../components/WebsiteLogs";
import { AlertHistory } from "../components/AlertHistory";

type WebsiteLogsLocationState = {
  websiteName?: string;
};

export function WebsiteLogsPage() {
  const { websiteId } = useParams();
  const location = useLocation();
  const state = location.state as WebsiteLogsLocationState | null;
  if (!websiteId) {
    return <Navigate to="/websites" />;
  }

  const websiteName = state?.websiteName ?? websiteId;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe size={22} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Website Logs</h1>
            <p className="text-sm">{websiteName}</p>
          </div>
        </div>

        <Link to="/websites" className="btn btn-sm btn-ghost">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="tabs tabs-border">
        <label className="tab gap-2">
          <input type="radio" name="website_tabs" defaultChecked />
          <Activity size={14} /> Logs
        </label>
        <div className="tab-content pt-4">
          <WebsiteLogs websiteId={websiteId} websiteName={websiteName} />
        </div>

        <label className="tab gap-2">
          <input type="radio" name="website_tabs" />
          <Bell size={14} /> Email Alerts
        </label>
        <div className="tab-content pt-4">
          <AlertHistory websiteId={websiteId} />
        </div>
      </div>
    </div>
  );
}
