import { clientRequest } from "services";
import { AxiosResponse } from "axios";
import { retrieveFromLocalStorage } from "./localStorage";
import { Tenant } from "interfaces";
import toast from "react-hot-toast";
import { isValidUrl } from "./utils";

type Response = {
  data: string;
  message?: string;
  success: boolean;
  error: any;
};
export const uploadFileToStorage = async (
  file: File,
  folder = ""
): Promise<Response | null> => {
  const formData = new FormData();
  formData.append("file", file);
  const tenant: Tenant = retrieveFromLocalStorage("tenant");
  formData.append(
    "folder",
    folder.trim() ? `${tenant?.id}/${folder.trim()}` : tenant?.id
  );

  try {
    const data: AxiosResponse<Response> | undefined =
      await clientRequest.file.upload(formData);

    if (data) {
      return data as unknown as Response;
    } else {
      return null;
    }
  } catch (error) {
    return { success: false, error, data: "" };
  }
};

export const uploadMultipleFilesToStorage = async (
  files: File[],
  folder = ""
): Promise<Response | null> => {
  const formData = new FormData();
  for (let index = 0; index < files?.length; index++) {
    const file = files?.[index];
    formData.append("files[]", file);
  }

  const tenant: Tenant = retrieveFromLocalStorage("tenant");
  formData.append(
    "folder",
    folder.trim() ? `${tenant?.id}/${folder.trim()}` : tenant?.id
  );

  try {
    const data: AxiosResponse<Response> | undefined =
      await clientRequest.file.uploadMultiple(formData);

    if (data) {
      return data as unknown as Response;
    } else {
      return null;
    }
  } catch (error) {
    return { success: false, error, data: "" };
  }
};

export const uploadFile = async (
  file: File | null,
  path: string,
  name?: string
) => {
  // Check if file is a valid URL, if yes, return the URL
  if (typeof file === "string" && isValidUrl(file)) {
    return file;
  }
  
  if (!file) return null;
  const response = await uploadFileToStorage(file, path);
  if (response?.success) {
    return response.data;
  } else {
    toast.error(`Unable to upload ${name || "file"}. Please try again.`);
    throw new Error(`File upload to ${path} failed`);
  }
};

export const uploadMultipleFiles = async (
  files: File[] | string[] | null,
  path: string,
  name?: string
) => {
  if (!files || files.length === 0) return null;

  // If files are URLs, return them directly
  if (typeof files[0] === "string" && isValidUrl(files[0])) {
    return files as string[];
  }

  // Proceed with uploading files if they are File objects
  const response = await uploadMultipleFilesToStorage(files as File[], path);
  if (response?.success) {
    return response.data;
  } else {
    toast.error(`Unable to upload ${name || "files"}. Please try again.`);
    throw new Error(`File upload to ${path} failed`);
  }
};
