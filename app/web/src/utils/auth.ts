// Auth utility functions for web application

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
  // Store authentication data
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

  // Get stored access token
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  // Get stored user data
  getUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  // Clear all authentication data
  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Update access token
  updateAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },
};
