import axios, { CanceledError } from "axios";
import { BASE_URL } from "../constants";

export { CanceledError };
export const apiClient = axios.create({
  baseURL: BASE_URL
  // validateStatus: () => true,
});

export default apiClient;
