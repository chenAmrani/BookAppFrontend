import axios, { CanceledError } from "axios";

export { CanceledError };
export const apiClient = axios.create({
  baseURL: "http://localhost:6969",
});

export default apiClient;
