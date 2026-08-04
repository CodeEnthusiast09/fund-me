import { clientRequest } from "services";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { isValidUrl } from "./utils";

type UploadResponse = {
  data: { url: string; publicId: string };
  message?: string;
  success: boolean;
  error: any;
};

export const uploadFileToStorage = async (
  file: File
): Promise<UploadResponse | null> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const data: AxiosResponse<UploadResponse> | undefined =
      await clientRequest.file.upload(formData);

    if (data) {
      return data as unknown as UploadResponse;
    } else {
      return null;
    }
  } catch (error) {
    return { success: false, error, data: { url: "", publicId: "" } };
  }
};

export const uploadFile = async (
  file: File | string | null,
  name?: string
) => {
  // Check if file is already a URL (e.g. unchanged on an update form), if
  // so return it as-is.
  if (typeof file === "string" && isValidUrl(file)) {
    return file;
  }

  if (!file || typeof file === "string") return null;

  const response = await uploadFileToStorage(file);
  if (response?.success) {
    return response.data.url;
  } else {
    toast.error(`Unable to upload ${name || "file"}. Please try again.`);
    throw new Error(`File upload failed`);
  }
};
