import axiosInstance from "./axios";
import { apiHandler } from "./api-handler";
import type { AddMonitorPayload, Monitor, MonitorListResponse } from "../types/monitor.types";

export const addMonitor = (payload: AddMonitorPayload) =>
  apiHandler<Monitor>(() => axiosInstance.post("/monitors", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const getMonitors = (page = 1, limit = 20) =>
  apiHandler<MonitorListResponse>(
    () => axiosInstance.get("/monitors", { params: { page, limit } }),
    { showErrorToast: true },
  );
