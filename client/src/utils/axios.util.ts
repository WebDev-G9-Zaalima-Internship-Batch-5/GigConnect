import axios from "axios";

const mode: string = import.meta.env.MODE;
const devURL: string = import.meta.env.VITE_DEV_API_URL;
const prodURL: string = import.meta.env.VITE_PROD_API_URL;

let baseURL: string;

switch (mode) {
  case "development":
    baseURL = devURL;
    break;

  case "production":
    baseURL = prodURL;
    break;

  default:
    baseURL = devURL;
    break;
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export { axiosInstance };
