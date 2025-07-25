import { AXIOS_INSTANCE_BASE } from "./_interceptor/_axios";

interface GenerateUploadUrlData {
  user_id: string;
  filename: string;
  file_type: string;
  content_type: string;
  expires_in_minutes: number;
}

export const generateUploadUrl = async (data: GenerateUploadUrlData) => {
  return AXIOS_INSTANCE_BASE.post(`/storage/generate-upload-url`, data);
};

// google cloud storage upload url
export const uploadFileToSignedUrl = async (blob: Blob, uploadUrl: string, contentType: string = "image/jpeg") => {
  return await AXIOS_INSTANCE_BASE.put(uploadUrl, blob, {
    headers: {
      'Content-Type': contentType,
    },
  });
};