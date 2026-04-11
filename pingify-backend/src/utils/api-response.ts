interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export const successResponse = <T>(data: T, message: string): IApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (message: string): IApiResponse<null> => ({
  success: false,
  data: null,
  message,
});