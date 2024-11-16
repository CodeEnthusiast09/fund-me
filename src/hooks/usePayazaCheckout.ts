"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PayazaCheckout from "payaza-web-sdk";
import { PayazaCheckoutOptionsInterface } from "payaza-web-sdk/lib/PayazaCheckoutDataInterface";
import { ConnectionMode } from "payaza-web-sdk/lib/PayazaCheckout";
import { InferType } from "yup";
import { payoutValidationSchema } from "validations";

type MutationProp = {
  data: InferType<typeof payoutValidationSchema>;
};

interface PayazaResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const usePayazaCheckout = () => {
  const router = useRouter();
  const merchantKey = process.env.NEXT_PUBLIC_PAYAZA_KEY;

  const { mutate, isPending, isSuccess } = useMutation<
    PayazaResponse,
    Error,
    MutationProp
  >({
    mutationFn: async ({ data }: MutationProp) => {
      return new Promise((resolve, reject) => {
        try {
          // Validate merchant key
          if (!merchantKey) {
            throw new Error("Payaza merchant key is not configured");
          }

          const checkoutData: PayazaCheckoutOptionsInterface = {
            merchant_key: process.env.NEXT_PUBLIC_PAYAZA_KEY!,
            connection_mode: (process.env.NODE_ENV === "production"
              ? "live"
              : "Test") as ConnectionMode,
            // currency_code: data.currency_code,
            currency_code: "NGN",
            email_address: data.email_address,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            checkout_amount: data.checkout_amount,
            currency: "₦",
            transaction_reference: `TX_${Date.now()}`,
            onClose: () => {
              reject(new Error("Checkout was closed"));
            },
            callback: (response) => {
              resolve({
                success: true,
                message: "Payment successful",
                data: response,
              });
            },
          };

          const checkout = new PayazaCheckout(checkoutData);
          checkout.showPopup();
        } catch (error) {
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error("An unknown error occurred"));
          }
        }
      });
    },
    onSuccess: (response) => {
      toast.success(response.message ?? "Payment completed successfully");
      router.back();
    },
    onError: (error: Error) => {
      // More specific error handling
      if (error.message.includes("merchant key")) {
        toast.error("Payment configuration error. Please contact support.");
        console.error("Payaza merchant key error:", error);
      } else {
        toast.error(error.message || "Payment failed. Please try again.");
      }
    },
  });

  return { mutate, isPending, isSuccess };
};
