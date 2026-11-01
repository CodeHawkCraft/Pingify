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
      // error toast already shown by apiHandler
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) => `input w-full ${hasError ? "input-error" : ""}`;

  return (
    <div className="max-w-lg mx-auto p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Add Monitor</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Track uptime for any public website or API.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            Monitor Name <span className="text-error" aria-hidden="true">*</span>
          </legend>
          <input
            {...register("name")}
            type="text"
            placeholder="My App"
            aria-required="true"
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
          />
          <p className="label text-error min-h-4">{errors.name?.message}</p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            Website URL <span className="text-error" aria-hidden="true">*</span>
          </legend>
          <input
            {...register("url")}
            type="text"
            placeholder="https://example.com"
            aria-required="true"
            aria-invalid={!!errors.url}
            className={inputClass(!!errors.url)}
          />
          <p className="label text-error min-h-4">{errors.url?.message}</p>
        </fieldset>

        <button type="submit" disabled={loading} className="btn btn-primary mt-2">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Add Monitor"}
        </button>
      </form>
    </div>
  );
}
