import axiosInstance from "./axios";
import { apiHandler } from "./api-handler";
import type { UserData, AuthPayload } from "../types/auth.types";

export const signup = (payload: AuthPayload) =>
  apiHandler<UserData>(() => axiosInstance.post("/auth/signup", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const login = (payload: AuthPayload) =>
  apiHandler<UserData>(() => axiosInstance.post("/auth/login", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const logout = () =>
  apiHandler<null>(() => axiosInstance.post("/auth/logout"), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const getMe = () =>
  apiHandler<UserData>(() => axiosInstance.get("/users/me"), {
    showSuccessToast: false,
    showErrorToast: false,
  });
