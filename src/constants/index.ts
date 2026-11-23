export const ROUTES = {
  register: "/users/register",
  login: "/users/login",
  me: "/auth/me",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  posts: "/posts",
  categories: "/categories",
};

export const COOKIES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  accessTokenMaxAge: 15 * 60 * 1000,
  refreshTokenMaxAge: 17 * 24 * 60 * 60 * 1000,
};
