export interface User {
  id: string;
  profileId?: string;
  username: string;
  email: string;
  token?: string;
}

const STORAGE_KEY = "gusto-current-user";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:1789";

function saveCurrentUser(user: User) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

let cachedCsrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to fetch CSRF token (${response.status}): ${message || response.statusText}`
    );
  }

  const data = await response.json();
  const token: string = data.csrfToken;
  cachedCsrfToken = token;
  return token;
}

async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedCsrfToken) {
    return cachedCsrfToken;
  }
  return fetchCsrfToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);

  const doFetch = async (csrfToken?: string) => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (!isSafeMethod && csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }

    return fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });
  };

  let response: Response;

  if (isSafeMethod) {
    response = await doFetch();
  } else {
    let token = await getCsrfToken();
    response = await doFetch(token);

    if (response.status === 403) {
      token = await getCsrfToken(true);
      response = await doFetch(token);
    }
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  return response.json();
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const result = await request<{
    user: { _id: string; name: string; email: string };
    token: string;
  }>("/api/users", {
    method: "POST",
    body: JSON.stringify({ name: username, email, password }),
  });

  return {
    id: result.user._id,
    username: result.user.name,
    email: result.user.email,
    token: result.token,
  };
}

export async function loginUser(
  emailOrUsername: string,
  password: string,
): Promise<User> {
  const result = await request<{
    message: string;
    user: { _id: string; name: string; email: string };
    token: string;
  }>("/api/auth", {
    method: "POST",
    body: JSON.stringify({ emailOrUsername, password }),
  });

  return {
    id: result.user._id,
    username: result.user.name,
    email: result.user.email,
    token: result.token,
  };
}

export async function logoutUser(): Promise<void> {
  const currentUser = getStoredUser();
  const token = currentUser?.token;

  await request<void>("/api/auth/logout", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  sessionStorage.removeItem(STORAGE_KEY);
}

export function setCurrentUser(user: User) {
  saveCurrentUser(user);
}

export function getCurrentUser(): User | null {
  return getStoredUser();
}