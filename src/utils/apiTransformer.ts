import type { BackendResponse } from "@/types/auth";

interface CustomApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

const getErrorMessageStr = (msg: unknown, err?: string): string => {
  if (Array.isArray(msg)) return msg.join(", ");
  if (typeof msg === "string") return msg;
  return err ?? "An error occurred";
};

const parseNestedErrorData = (dataObj: unknown): CustomApiError | null => {
  if (!dataObj || typeof dataObj !== "object") return null;
  const obj = dataObj as {
    message?: string | string[];
    statusCode?: number;
    error?: string;
  };

  return {
    message: getErrorMessageStr(obj.message, obj.error),
    ...(obj.statusCode ? { statusCode: obj.statusCode } : {}),
    ...(obj.error ? { error: obj.error } : {}),
  };
};

const parseDirectErrorMessage = (response: unknown): CustomApiError | null => {
  const msg = (response as { message?: unknown } | null)?.message;
  return typeof msg === "string" ? { message: msg } : null;
};

const extractObjectMessage = (error: Record<string, unknown>): string | null => {
  if (typeof error.message === "string") return error.message;
  if ("data" in error) return apiTransformer.transformErrorResponse(error).message;
  return null;
};

export const apiTransformer = {
  unwrapData: <T>(response: T | BackendResponse<T>): T => {
    const data = (response as BackendResponse<T> | null)?.data;
    return (data ?? response) as T;
  },

  transformErrorResponse: (response: unknown): CustomApiError => {
    const nested = parseNestedErrorData((response as { data?: unknown } | null)?.data);
    if (nested) return nested;

    const direct = parseDirectErrorMessage(response);
    if (direct) return direct;

    return { message: "An unexpected error occurred. Please try again." };
  },

  transformError: (
    error: unknown,
    fallback = "An unexpected error occurred. Please try again."
  ): string => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      return extractObjectMessage(error as Record<string, unknown>) ?? fallback;
    }
    return fallback;
  },
};
