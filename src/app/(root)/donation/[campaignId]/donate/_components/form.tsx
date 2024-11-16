"use client";

import { Input } from "components/input";
import { Button } from "components/button";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { payoutValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Select } from "components/select";
import { usePayazaCheckout } from "hooks";

const Form = () => {
  const { mutate: checkout, isPending: isSubmitting } = usePayazaCheckout();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(payoutValidationSchema),
  });

  const handleSignUp: SubmitHandler<
    InferType<typeof payoutValidationSchema>
  > = (data) => checkout({ data });

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <Input
        label="Firstname"
        type="text"
        placeholder="Enter Firstname"
        error={errors?.first_name}
        {...register("first_name", { required: true })}
      />

      <Input
        label="Lastname"
        {...register("last_name", {
          required: true,
        })}
        type="text"
        placeholder="Enter Lastname"
        error={errors?.last_name}
        showRequiredAsterik
      />

      <Input
        label="Email"
        {...register("email_address", {
          required: true,
        })}
        type="text"
        placeholder="Enter Email"
        error={errors?.email_address}
        showRequiredAsterik
      />

      <Input
        label="Phone Number"
        {...register("phone_number", {
          required: true,
        })}
        type="number"
        placeholder="Enter Phone Number"
        error={errors?.phone_number}
        showRequiredAsterik
      />

      <Select
        label="Currency Code"
        {...register("currency_code", {
          required: true,
        })}
        error={errors?.currency_code}
        showRequiredAsterik
        options={[
          { label: "Naira", value: "ngn" },
          { label: "Cedis", value: "ghc" },
        ]}
      />

      <Input
        label="Amount"
        {...register("checkout_amount", {
          required: true,
        })}
        type="Number"
        error={errors?.checkout_amount}
        placeholder="Enter Amount"
        showRequiredAsterik
      />

      <div className="pt-5 flex gap-4 md:justify-end flex-wrap">
        <Button
          variant="transparent"
          onClick={() => router.back()}
          className="h-12 w-full md:w-auto order-last md:order-first"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="h-12 w-full md:w-auto bg-lightGreen"
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Form;
