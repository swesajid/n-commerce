/** @format */

import { iRate } from "../components/validators/rates.validator";
import logger from "../config/logger";

const NAMESPACE = "Rates API Calls";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPIRate {
  first_rate: string;
  all_rate: string;
  allday_rate: string;
  categorie: string;
  _id: string;
  createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = "success" | "fail";

export const getAllRatesFromAPI = async (): Promise<iAPIRate[]> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/rates`, {
      headers: { "skon-auth-token": token },
    });
    const data: iAPIRate[] = await res.json();
    return data;
  } catch (err: any) {
    logger.error(NAMESPACE, "Error getting rate list", err);
    return [];
  }
};

export const deleteRateFromAPI = async (
  id: string
): Promise<"success" | "fail"> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/rates/${id}`, {
      method: "DELETE",
      headers: { "skon-auth-token": token },
    });
    const data = await res.json();

    if (data.msg) {
      return "success";
    } else {
      return "fail";
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "Error Deleting Resource", err);
    return "fail";
  }
};

export const createRateFromAPI = async (
  data: iRate
): Promise<GENERAL_RETURN_TYPE> => {
  try {
    console.log("Inside API", data);

    const formData = new FormData();
    formData.append("first_rate", data.first_rate);
    formData.append("all_rate", data.all_rate);
    formData.append("allday_rate", data.allday_rate);
    formData.append("categorie", data.categorie);

    const token = localStorage.getItem("skon-auth-token") as string;
    const res = await fetch(`${API_BASE}/rates/create`, {
      method: "POST",
      headers: { "skon-auth-token": token },
      body: formData,
    });
    const info = await res.json();

    if (info.errors) {
      console.log(info.errors);

      return info.errors;
    } else {
      return "success";
    }
  } catch (err: any) {
    logger.error(NAMESPACE, "Create Rate Error", err);
    return "fail";
  }
};

export const getSingleRateFromAPI = async (
  id: string
): Promise<iAPIRate | null> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/rates/${id}`, {
      headers: { "skon-auth-token": token },
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    logger.error(NAMESPACE, "Get Single Rate", err);
    return null;
  }
};

export const updateRatefromAPI = async (
  id: string,
  rate: iRate
): Promise<boolean> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const formData = new FormData();

    formData.append("rateId", id);
    formData.append("first_rate", rate.first_rate);
    formData.append("all_rate", rate.all_rate);
    formData.append("allday_rate", rate.allday_rate);
    formData.append("categorie", rate.categorie);

    const res = await fetch(`${API_BASE}/rates/update`, {
      method: "PATCH",
      headers: {
        "skon-auth-token": token,
      },
      body: formData,
    });
    const data = await res.json();

    if (data.errors) {
      logger.error(NAMESPACE, "Checking error: ", data);
      return false;
    }

    return true;
  } catch (err: any) {
    logger.error(NAMESPACE, "Update rate error");
    return false;
  }
};
