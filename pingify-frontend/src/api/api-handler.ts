import axios from "axios";
import toast from "react-hot-toast";

type ApiResponse<T> = {
  data: T;
  message: string;
};

type ApiErrorResponse = {
  message: string;
};

type ApiHandlerOptions = {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
};

export const apiHandler = async <T>(
  request: () => Promise<{ data: ApiResponse<T> }>,
  options: ApiHandlerOptions = {},
): Promise<T> => {
  const { showErrorToast = false, showSuccessToast = false } = options;

  try {
    const response = await request();

    if (showSuccessToast) {
      toast.success(response.data.message || "Operation successful!");
    }

    return response.data.data;
  } catch (error) {
    if (showErrorToast) {
      let errorMessage = "Something went wrong";
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }

    throw error;
  }
};
