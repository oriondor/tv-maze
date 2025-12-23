type RequestBody = Record<string, unknown>;
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiOptions {
  method?: RequestMethod;
  body?: RequestBody;
  signal?: AbortSignal;
}

// Overload 1: Just URL (GET request)
export async function useApi<T = unknown>(url: string): Promise<T>;

// Overload 2: URL + options
export async function useApi<T = unknown>(
  url: string,
  options: ApiOptions
): Promise<T>;

export async function useApi<T = unknown>(
  url: string,
  options?: ApiOptions
): Promise<T> {
  return (await $fetch(url, {
    method: options?.method || "GET",
    body: options?.body,
    signal: options?.signal,
  })) as T;
}
