/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;

export async function api(path: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return new Response(null, { status: 401 });
    }

    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API request failed");
  }

  return res;
}

export async function get<T>(path: string) {
  const res = await api(path, { method: "GET" });
  return res.json() as Promise<T>;
}

export async function post<T>(path: string, body: any) {
  const res = await api(path, { method: "POST", body: JSON.stringify(body) });
  return res.json() as Promise<T>;
}

export async function put<T>(path: string, body: any) {
  const res = await api(path, { method: "PUT", body: JSON.stringify(body) });
  return res.json() as Promise<T>;
}

export async function del<T>(path: string) {
  const res = await api(path, { method: "DELETE" });
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
