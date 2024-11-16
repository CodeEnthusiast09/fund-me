import { APIResponse, ApiError } from "interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientRequest } from "services";
import { InferType } from "yup";
import { campaignValidationSchema } from "validations";
import { uploadFile } from "lib/file-upload";

type MutationProp = {
  data: InferType<typeof campaignValidationSchema>;
};

export const useCreateCampaign = (onSuccess?: Function) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: async ({ data }: MutationProp) => {
      // const uploads: any[] = [];

      // if (data.headerImage) {
      //   const fileUpload = uploadFile(
      //     data.headerImage as File,
      //     `campaign/image`,
      //     "Image"
      //   ).then((fileUrl) => {
      //     if (fileUrl) {
      //       data.headerImage = fileUrl;
      //       return true;
      //     }
      //     return false;
      //   });
      //   uploads.push(fileUpload);
      // }
      // const results = await Promise.all(uploads);

      // if (results?.every((result) => result === true)) {
      //   return clientRequest.campaign.create(data);
      // } else {
      //   throw new Error("File upload failed");
      // }
      return clientRequest.campaign.create(data);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        toast.success(response?.message ?? "Campaign created successfully");
        queryClient.invalidateQueries({
          queryKey: ["campaign"],
        });

        onSuccess?.();
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Opps! Something went wrong.");
    },
  });

  return { mutate, isPending, isSuccess };
};
