/** @format */

import { iReceipt } from "../components/validators/receipts.validator";
import logger from "../config/logger";

const NAMESPACE = "Receipts API Calls";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPIReceipt {
  v_number: string;
  date: Date;
  check?: boolean;
  categorie: string;
  _id: string;
  createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = "success" | "fail";

export const getAllReceiptsFromAPI = async (): Promise<iAPIReceipt[]> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/receipts`, {
      headers: { "skon-auth-token": token },
    });
    const data: iAPIReceipt[] = await res.json();
    return data;
  } catch (err: any) {
    logger.error(NAMESPACE, "Error getting receipts list", err);
    return [];
  }
};
export const deleteReceiptFromAPI = async (
  id: string
): Promise<"success" | "fail"> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/receipts/${id}`, {
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
    logger.error(NAMESPACE, "Error Deleting Receipt", err);
    return "fail";
  }
};

export const createReceiptFromAPI = async (
  data: iReceipt
): Promise<GENERAL_RETURN_TYPE> => {
  try {
    console.log("Inside API", data);

    const formData = new FormData();

    formData.append("v_number", data.v_number);
    formData.append("date", data.date);
    formData.append("check", data.check.toString());
    formData.append("categorie", data.categorie);

    const token = localStorage.getItem("skon-auth-token") as string;
    const res = await fetch(`${API_BASE}/receipts/create`, {
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
    logger.error(NAMESPACE, "Create Receipt Error", err);
    return "fail";
  }
};

export const getSingleReceiptFromAPI = async (
  id: string
): Promise<iAPIReceipt | null> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");
    const res = await fetch(`${API_BASE}/receipts/${id}`, {
      headers: { "skon-auth-token": token },
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    logger.error(NAMESPACE, "Get Single receipt", err);
    return null;
  }
};
//     try {
//         const token = <string>localStorage.getItem('skon-auth-token');
//         const res = await fetch(`${API_BASE}/events/update`, {
//             method: 'PATCH',
//             headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 eventId: id,
//                 name: event.name,
//                 description: event.description,
//                 date: event.date,
//                 timezone: event.timezone,
//                 location: event.location,
//                 registrationLink: event.registrationLink,
//                 permalink: event.permalink,
//                 publish: event.publish,
//             }),
//         });
//         const data = await res.json();

//         if (data.errors) {
//             logger.error(NAMESPACE, 'Checking error: ', data);
//             return false;
//         }

//         return true;
//     } catch (err: any) {
//         logger.error(NAMESPACE, 'Update event error');
//         return false;
//     }
// };

export const updateReceiptfromAPI = async (
  id: string,
  receipt: iReceipt
): Promise<boolean> => {
  try {
    const token = <string>localStorage.getItem("skon-auth-token");

    const formData = new FormData();
    formData.append("receiptId", id);
    formData.append("categorie", receipt.categorie);
    formData.append("date", receipt.date);
    formData.append("v_name", receipt.v_number);
    formData.append("check", receipt.check.toString());

    const res = await fetch(`${API_BASE}/receipts/update`, {
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
    logger.error(NAMESPACE, "Update receipt error", err);
    return false;
  }
};
