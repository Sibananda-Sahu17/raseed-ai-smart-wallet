import { AXIOS_INSTANCE, AXIOS_INSTANCE_BASE } from "./_interceptor/_axios";
import axios from 'axios';

interface GenerateUploadUrlData {
  filename: string;
  file_type: string;
  content_type: string;
  expires_in_minutes: number;
}

export const generateUploadUrl = async (data: GenerateUploadUrlData) => {
  return AXIOS_INSTANCE.post(`/storage/generate-upload-url`, data);
};

// Google Cloud Storage upload - use direct axios call to signed URL
export const uploadFileToSignedUrl = async (blob: Blob, uploadUrl: string, contentType: string = "image/jpeg") => {
  try {
    const response = await axios.put(uploadUrl, blob, {
      headers: {
        'Content-Type': contentType,
      },
      withCredentials: false,
    });
    return response;
  } catch (error) {
    console.error('Error uploading to signed URL:', error);
    throw error;
  }
};