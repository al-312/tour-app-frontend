import { type CustomApiError, extractErrorList } from "./api-error-parser";

interface BackendResponse<T> {
  statusCode: number;
  message: string | string[];
  data: T;
  success?: boolean;
}

const extractErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string => {
  const list = extractErrorList(error);
  if (list.length > 0 && list[0]) {
    return list[0];
  }
  return fallback;
};

function extractStatusAndDetails(obj: Record<string, unknown>): {
  statusCode?: number | undefined;
  errorTitle?: string | undefined;
  path?: string | undefined;
  timestamp?: string | undefined;
} {
  const targetObj =
    typeof obj.data === "object" && obj.data !== null
      ? (obj.data as Record<string, unknown>)
      : obj;

  const statusCode =
    typeof targetObj.statusCode === "number"
      ? targetObj.statusCode
      : typeof obj.status === "number"
        ? obj.status
        : undefined;

  const errorTitle = typeof targetObj.error === "string" ? targetObj.error : undefined;
  const path = typeof targetObj.path === "string" ? targetObj.path : undefined;
  const timestamp =
    typeof targetObj.timestamp === "string" ? targetObj.timestamp : undefined;

  return { statusCode, errorTitle, path, timestamp };
}

const parseBackendError = (
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): CustomApiError => {
  const messages = extractErrorList(error);
  const message = messages.length > 0 ? messages.join(", ") : fallback;

  if (typeof error !== "object" || error === null) {
    return { message, messages };
  }

  const { statusCode, errorTitle, path, timestamp } = extractStatusAndDetails(
    error as Record<string, unknown>
  );

  return {
    message,
    messages,
    statusCode,
    error: errorTitle,
    path,
    timestamp,
  };
};

export const apiTransformer = {
  unwrapData: <T>(response: T | BackendResponse<T>): T => {
    const data = (response as BackendResponse<T> | null)?.data;
    return (data ?? response) as T;
  },

  transformErrorResponse: (response: unknown): CustomApiError => {
    return parseBackendError(response);
  },

  transformError: (
    error: unknown,
    fallback = "An unexpected error occurred. Please try again."
  ): string => {
    return extractErrorMessage(error, fallback);
  },
};
