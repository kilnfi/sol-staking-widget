import { Method, ResponseType } from "axios";
import instance from "./axios";

// Fetcher function used by SWR by default to make requests to our API
export const swrFetcher = async <T>(url: string): Promise<T> => {
  return instance.get(url).then((res) => res.data);
};

// API wrapper function used to make GET, POST, PUT and PATCH requests
export const request = async <T>(
  method: Method,
  url: string,
  data?: any,
  responseType: ResponseType = "json",
): Promise<T> => {
  return instance({
    method,
    url,
    data,
    responseType,
  }).then((res) => (responseType === "json" ? res.data : res));
};
