"use client";

import { Input } from "components/input";
import { Button } from "components/button";
import { useRouter } from "next/navigation";
import { useSignUp } from "hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Form = () => {
  const { mutate: signUp, isPending: isSubmitting } = useSignUp();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });

  const handleSignUp: SubmitHandler<
    InferType<typeof signUpValidationSchema>
  > = (data) => signUp({ data });

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <Input
        label="Firstname"
        type="text"
        placeholder="Enter Firstname"
        error={errors?.firstname}
        {...register("firstname", { required: true })}
      />

      <Input
        label="Lastname"
        {...register("gender", {
          required: true,
        })}
        type="text"
        placeholder="Enter Lastname"
        error={errors?.gender}
        showRequiredAsterik
      />

      <Input
        label="Email"
        {...register("gender", {
          required: true,
        })}
        type="text"
        placeholder="Enter Email"
        error={errors?.gender}
        showRequiredAsterik
      />

      <Input
        label="Amount"
        {...register("gender", {
          required: true,
        })}
        type="Number"
        error={errors?.gender}
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
          className="h-12 w-full md:w-auto"
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Form;
