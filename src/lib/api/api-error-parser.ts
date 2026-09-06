export interface CustomApiError {
  message: string;
  messages: string[];
  statusCode?: number | undefined;
  error?: string | undefined;
  path?: string | undefined;
  timestamp?: string | undefined;
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

export const extractErrorList = (error: unknown): string[] => {
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
