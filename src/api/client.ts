const TOKEN_KEY = 'omnistore_token';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = false } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Network error — is the backend server running?',
      0
    );
  }

  let json: { success?: boolean; message?: string; data?: unknown } | null =
    null;
  try {
    json = await res.json();
  } catch {
    // response was not JSON
  }

  if (!res.ok || (json && json.success === false)) {
    throw new ApiError(
      json?.message || `Request failed (${res.status})`,
      res.status
    );
  }

  return (json?.data ?? null) as T;
}