import { API_URL_V1 } from "../constants/staticUrls";
import { AXIOS_INSTANCE_BASE } from "./_interceptor/_axios";

export const createReceipt = async ({ data }) => {
    return AXIOS_INSTANCE_BASE.post(`/receipts`, data);
};