import axiosInstance from "./axios";
import { apiHandler } from "./api-handler";
import type { SignupPayload, LoginPayload, UserData } from "../types/auth.types";

export const signup = (payload: SignupPayload) =>
  apiHandler<UserData>(() => axiosInstance.post("/auth/signup", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const login = (payload: LoginPayload) =>
  apiHandler<UserData>(() => axiosInstance.post("/auth/login", payload), {
    showSuccessToast: true,
    showErrorToast: true,
  });

export const logout = () =>
  apiHandler<null>(() => axiosInstance.post("/auth/logout"), {
    showSuccessToast: true,
    showErrorToast: true,
  });
