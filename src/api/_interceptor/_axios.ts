import axios from 'axios';
import { API_URL_V1, BASE_API_URL } from '../../constants/staticUrls';

// Create an axios instance
export const AXIOS_INSTANCE = axios.create({
  baseURL: API_URL_V1,
  withCredentials: true, // Include cookies in requests
});

export const AXIOS_INSTANCE_BASE = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // Include cookies in requests
});

AXIOS_INSTANCE.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

AXIOS_INSTANCE_BASE.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);