import { API_URL_V1 } from "../constants/staticUrls";
import { AXIOS_INSTANCE_BASE } from "./_interceptor/_axios";



interface CreateRawReceiptData {
  filename: string;
  file_type: string;
  content_type: string;
  file_size: number;
  file_path: string;
}

export const createRawReceipt = async (data: CreateRawReceiptData) => {
    return AXIOS_INSTANCE_BASE.post(`/receipt/create-raw-receipt`, data);
};