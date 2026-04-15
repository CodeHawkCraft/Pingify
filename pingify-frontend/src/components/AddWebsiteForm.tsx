import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMonitorSchema } from "../validations/monitor.validation";
import { addMonitor } from "../api/monitor.api";

export function AddWebsiteForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addMonitorSchema),
  });

  const onSubmit = async (data: { name: string; url: string }) => {
    try {
      setLoading(true);
      await addMonitor({ name: data.name, url: data.url });
      reset();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `input w-full input-bordered w-full${hasError && "input-error"}`;

  return (
    <div className="max-w-lg mx-auto p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Add Monitor</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Track uptime for any public website or API.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Monitor Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="My App"
            className={inputClass(!!errors.name)}
          />
          {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Website URL</label>
          <input
            {...register("url")}
            type="text"
            placeholder="https://example.com"
            className={inputClass(!!errors.url)}
          />
          {errors.url && <p className="text-error text-xs">{errors.url.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Add Monitor"}
        </button>
      </form>
    </div>
  );
}
