export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_doctor?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
  user?: User;
}

export const authUtils = {
  setAuth: (authData: AuthResponse) => {
    if (authData.access) {
      localStorage.setItem("accessToken", authData.access);
    }
    if (authData.refresh) {
      localStorage.setItem("refreshToken", authData.refresh);
    }
    if (authData.user) {
      localStorage.setItem("user", JSON.stringify(authData.user));
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  updateAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },
};
