/** @format */

import { NextRouter } from "next/router";
import { iRegister } from "../components/validators/registration.validator";
import logger from "../config/logger";
import { AnalyticsTrackingEvent } from "../analytics/analytics.track";

type BASIC_RETURN_TYPE = "success" | "fail";

const NAMESPACE = "Auth API Calls";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const tryLogin = async (
  username: string,
  password: string,
  router: NextRouter,
  redirectUrl: string
) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      //   console.log("reached");
      localStorage.setItem("skon-auth-token", data.token);
      AnalyticsTrackingEvent("Login", username, data.email, data.name);
      router.push(redirectUrl);
    } else {
      return data.errors[0].msg;
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "Login error", err);
    return "fail";
  }
};

export const tryRegister = async (
  data: iRegister
): Promise<BASIC_RETURN_TYPE> => {
  const body = JSON.stringify(data, null, 2);
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json();

    if (data.errors) {
      logger.error(NAMESPACE, "User creation error", data.errors[0].msg);
      return "fail";
      // router.push('/auth/login');
    }

    localStorage.setItem("skon-auth-token", data.token);
    return "success";
  } catch (err: any) {
    logger.error(NAMESPACE, "User creation error", err);
    return "fail";
  }
};
