"use client";
import { useMutation } from "@tanstack/react-query";
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
  transactionReference: string;
}

export const usePayazaCheckout = () => {
  const merchantKey = process.env.NEXT_PUBLIC_PAYAZA_KEY;

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation<
    PayazaResponse,
    Error,
    MutationProp
  >({
    mutationFn: async ({ data }: MutationProp) => {
      return new Promise((resolve, reject) => {
        try {
          if (!merchantKey) {
            throw new Error("Payaza merchant key is not configured");
          }

          const transactionReference = `TX_${Date.now()}`;

          const checkoutData: PayazaCheckoutOptionsInterface = {
            merchant_key: merchantKey,
            connection_mode: (process.env.NODE_ENV === "production"
              ? "live"
              : "Test") as ConnectionMode,
            currency_code: data.currency_code,
            email_address: data.email_address,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            checkout_amount: data.checkout_amount,
            currency: "₦",
            transaction_reference: transactionReference,
            onClose: () => {
              reject(new Error("Checkout was closed"));
            },
            callback: (response) => {
              resolve({
                success: true,
                message: "Payment successful",
                data: response,
                transactionReference,
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
  });

  return { mutate, mutateAsync, isPending, isSuccess };
};
