interface CustomApiError {
  message: string;
  messages: string[];
  statusCode?: number | undefined;
  error?: string | undefined;
  path?: string | undefined;
  timestamp?: string | undefined;
}

interface BackendResponse<T> {
  statusCode: number;
  message: string | string[];
  data: T;
  success?: boolean;
}

const getPayloadFromError = (error: unknown): unknown => {
  if (!error || typeof error !== "object") return error;
  const obj = error as Record<string, unknown>;
  if (obj.data) return getPayloadFromError(obj.data);
  if (obj.response && typeof obj.response === "object") {
    const resp = obj.response as Record<string, unknown>;
    if (resp.data) return getPayloadFromError(resp.data);
  }
  return obj;
};

const extractErrorList = (error: unknown): string[] => {
  if (!error) return [];
  if (typeof error === "string") return error.trim() !== "" ? [error.trim()] : [];

  const payload = getPayloadFromError(error);
  if (!payload || typeof payload !== "object") {
    return typeof payload === "string" && payload.trim() !== "" ? [payload.trim()] : [];
  }

  const obj = payload as Record<string, unknown>;

  if (Array.isArray(obj.message)) {
    const list = obj.message.map((item) => String(item).trim()).filter(Boolean);
    if (list.length > 0) return list;
  }

  if (typeof obj.message === "string" && obj.message.trim() !== "") {
    return [obj.message.trim()];
  }

  if (typeof obj.error === "string" && obj.error.trim() !== "") {
    return [obj.error.trim()];
  }

  return [];
};

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

const parseBackendError = (
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): CustomApiError => {
  const messages = extractErrorList(error);
  const message = messages.length > 0 ? messages.join(", ") : fallback;

  let statusCode: number | undefined;
  let errorTitle: string | undefined;
  let path: string | undefined;
  let timestamp: string | undefined;

  if (typeof error === "object" && Boolean(error)) {
    const obj = error as Record<string, unknown>;
    const targetObj =
      "data" in obj && Boolean(obj.data) && typeof obj.data === "object"
        ? (obj.data as Record<string, unknown>)
        : obj;

    if (typeof targetObj.statusCode === "number") {
      statusCode = targetObj.statusCode;
    } else if (typeof obj.status === "number") {
      statusCode = obj.status;
    }

    if (typeof targetObj.error === "string") {
      errorTitle = targetObj.error;
    }

    if (typeof targetObj.path === "string") {
      path = targetObj.path;
    }

    if (typeof targetObj.timestamp === "string") {
      timestamp = targetObj.timestamp;
    }
  }

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
