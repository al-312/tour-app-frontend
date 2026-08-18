interface CustomApiError {
  message: string;
  statusCode?: number | undefined;
  error?: string | undefined;
}

interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const getErrorMessageStr = (msg: unknown, err?: string): string => {
  if (Array.isArray(msg)) return msg.join(", ");
  return typeof msg === "string" ? msg : (err ?? "An error occurred");
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
    statusCode: obj.statusCode,
    error: obj.error,
  };
};

const parseDirectErrorMessage = (response: unknown): CustomApiError | null => {
  const msg = (response as { message?: unknown } | null)?.message;
  return typeof msg === "string" ? { message: msg } : null;
};

const extractObjectMessage = (error: Record<string, unknown>): string | null => {
  if (typeof error.message === "string") return error.message;
  return "data" in error ? apiTransformer.transformErrorResponse(error).message : null;
};

export const apiTransformer = {
  unwrapData: <T>(response: T | BackendResponse<T>): T => {
    const data = (response as BackendResponse<T> | null)?.data;
    return (data ?? response) as T;
  },

  transformErrorResponse: (response: unknown): CustomApiError => {
    return (
      parseNestedErrorData((response as { data?: unknown } | null)?.data) ??
      parseDirectErrorMessage(response) ?? {
        message: "An unexpected error occurred. Please try again.",
      }
    );
  },

  transformError: (
    error: unknown,
    fallback = "An unexpected error occurred. Please try again."
  ): string => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    return extractObjectMessage(error as Record<string, unknown>) ?? fallback;
  },
};
