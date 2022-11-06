/** @format */

export type USER_ROLE = "admin" | "member" | "cmember";
export type CAN_SKATE_EXCELLENCE = "Engaged" | "Achieved" | "Exceeded";

export interface iError extends Error {
  statusCode?: number;
}
