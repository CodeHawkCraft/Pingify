import axiosInstance from "./axios";
import { apiHandler } from "./api-handler";
import type { AddMonitorPayload, Monitor } from "../types/monitor.types";

export const addMonitor = (payload: AddMonitorPayload) =>
  apiHandler<Monitor>(() => axiosInstance.post("/monitors", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });
