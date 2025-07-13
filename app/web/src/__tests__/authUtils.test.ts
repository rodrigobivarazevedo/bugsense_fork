import { authUtils } from "../utils/auth";

describe("authUtils", () => {
  const mockAuth = {
    access: "access-token",
    refresh: "refresh-token",
    user: { id: 1, name: "Test User" },
  };

  afterEach(() => {
    authUtils.clearAuth();
  });

  it("sets and gets access token", () => {
    authUtils.setAuth(mockAuth as any);
    expect(authUtils.getAccessToken()).toBe("access-token");
  });

  it("sets and gets user", () => {
    authUtils.setAuth(mockAuth as any);
    expect(authUtils.getUser()).toMatchObject({ id: 1, name: "Test User" });
  });

  it("clears auth", () => {
    authUtils.setAuth(mockAuth as any);
    authUtils.clearAuth();
    expect(authUtils.getAccessToken()).toBeNull();
    expect(authUtils.getUser()).toBeNull();
  });
});
