"use client";
import { useMutation } from "@tanstack/react-query";
import PayazaCheckout from "payaza-web-sdk";
import { PayazaCheckoutOptionsInterface } from "payaza-web-sdk/lib/PayazaCheckoutDataInterface";
import { ConnectionMode } from "payaza-web-sdk/lib/PayazaCheckout";
import PayazaCallbackResponse, {
  PayazaCallbackResponseType,
} from "payaza-web-sdk/lib/PayazaCallbackData";
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

          // crypto.randomUUID(), not a timestamp -- a predictable
          // reference is guessable/replayable across concurrent
          // checkouts, which is exactly what the backend's donor-scoped
          // idempotency check exists to defend against, but there's no
          // reason to lean on that as the only defense when a real nonce
          // is free.
          const transactionReference = `TX_${crypto.randomUUID()}`;

          const checkoutData: PayazaCheckoutOptionsInterface = {
            merchant_key: merchantKey,
            connection_mode: (process.env.NODE_ENV === "production"
              ? "Live"
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
            // Typed as `object` to match PayazaCheckoutOptionsInterface's
            // declared callback signature; cast internally to read it.
            callback: (response: object) => {
              const result = response as PayazaCallbackResponse;

              // The SDK invokes this same callback for both error and
              // success terminal states (see handleClientError /
              // handleSuccess in the SDK source) -- resolving
              // unconditionally here would report a declined payment as
              // "successful" to the user.
              if (result?.type !== PayazaCallbackResponseType.SUCCESS) {
                reject(new Error(result?.data?.message || "Payment failed"));
                return;
              }

              resolve({
                success: true,
                message: result?.data?.message ?? "Payment successful",
                data: result,
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
