import "server-only";

export type FetchJsonOptions = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  retries?: number;
  next?: { revalidate?: number };
};

export class HttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJson<T>(
  url: string,
  {
    method = "GET",
    headers,
    body,
    timeoutMs = 8000,
    retries = 1,
    next,
  }: FetchJsonOptions = {}
): Promise<T> {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
        next,
      });

      if (!res.ok) {
        throw new HttpError(`HTTP ${res.status}`, res.status);
      }

      return (await res.json()) as T;
    } catch (e) {
      lastError = e;
      if (attempt >= retries) break;
      const backoff = 250 * Math.pow(2, attempt);
      await sleep(backoff);
    } finally {
      clearTimeout(timeout);
    }

    attempt += 1;
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed.");
}

