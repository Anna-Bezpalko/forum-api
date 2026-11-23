import type { Response } from "express";
import { config } from "../config.js";
import { AUTH_COOKIE_OPTIONS, COOKIES } from "../constants/index.js";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie(COOKIES.accessToken, accessToken, {
    httpOnly: AUTH_COOKIE_OPTIONS.httpOnly,
    secure: config.nodeEnv === "production",
    sameSite: AUTH_COOKIE_OPTIONS.sameSite,
    maxAge: AUTH_COOKIE_OPTIONS.accessTokenMaxAge,
  });

  res.cookie(COOKIES.refreshToken, refreshToken, {
    httpOnly: AUTH_COOKIE_OPTIONS.httpOnly,
    secure: config.nodeEnv === "production",
    sameSite: AUTH_COOKIE_OPTIONS.sameSite,
    maxAge: AUTH_COOKIE_OPTIONS.refreshTokenMaxAge,
  });
}

export function clearAuthCookies(res: Response) {
  const options = {
    httpOnly: AUTH_COOKIE_OPTIONS.httpOnly,
    secure: config.nodeEnv === "production",
    sameSite: AUTH_COOKIE_OPTIONS.sameSite,
  };

  res.clearCookie(COOKIES.accessToken, options);
  res.clearCookie(COOKIES.refreshToken, options);
}
