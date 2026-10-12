function getApiBase(): string {
  let raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  raw = raw.trim().replace(/\/+$/, '');
  if (!raw.endsWith('/api/v1')) {
    raw = `${raw}/api/v1`;
  }
  return raw;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

class ApiClient {
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('examsathi_token');
      const storedUser = localStorage.getItem('examsathi_user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch {
          this.user = null;
        }
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('examsathi_token', token);
      else localStorage.removeItem('examsathi_token');
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('examsathi_token');
    }
    return this.token;
  }

  setUser(user: AuthUser | null) {
    this.user = user;
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('examsathi_user', JSON.stringify(user));
      else localStorage.removeItem('examsathi_user');
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  getUser(): AuthUser | null {
    if (!this.user && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('examsathi_user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch {
          this.user = null;
        }
      }
    }
    return this.user;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return user.roles.includes('ADMIN') || user.roles.includes('SUPER_ADMIN');
  }

  logout() {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('examsathi_token');
      localStorage.removeItem('examsathi_user');
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = `${getApiBase()}/${cleanEndpoint}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error?.message || errorData.message || 'Network request failed');
      }

      return (await response.json()) as T;
    } catch (err: any) {
      throw err;
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
