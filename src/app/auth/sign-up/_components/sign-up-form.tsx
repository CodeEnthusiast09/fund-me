"use client";

import { Input } from "components/input";
import { MaskPasswordInput } from "components/mask-password-input";
import { Button } from "components/button";
import { Select } from "components/select";
import Link from "next/link";
import { useSignUp } from "hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaFacebook } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { IoLogoApple } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

export const SignUpForm = () => {
  const { mutate: signUp, isPending: isSubmitting } = useSignUp();

  const {
    register,
    handleSubmit,
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
        placeholder="Enter firstname"
        error={errors?.firstname}
        {...register("firstname", { required: true })}
      />
      <Input
        label="Lastname"
        type="text"
        placeholder="Enter lastname"
        error={errors?.lastname}
        {...register("lastname", { required: true })}
      />
      <Input
        label="Email"
        type="text"
        placeholder="Enter email"
        error={errors?.email}
        {...register("email", { required: true })}
      />

      <Select
        label="Gender"
        {...register("gender", {
          required: true,
        })}
        error={errors?.gender}
        showRequiredAsterik
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
      />

      <div className="relative">
        <MaskPasswordInput
          label="Password"
          placeholder="Enter Password"
          error={errors?.password}
          {...register("password", { required: true })}
        />

        <div className="text-lg py-3 flex justify-start items-center">
          <p>already have an account?&nbsp;</p>
          <Link className="text-lightGreen underline" href="/auth/login">
            Login
          </Link>
        </div>
      </div>
      <div className="pt-5">
        <Button
          type="submit"
          variant="primary"
          className="block w-full cursor-pointer"
          isLoading={isSubmitting}
        >
          Sign Up
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-7">
        <div className="h-0.5 bg-black rounded-full flex-1" />
        <p>Or</p>
        <div className="h-0.5 bg-black rounded-full flex-1" />
      </div>
      <div className="flex justify-center gap-7 mt-7">
        <div className="flex flex-col items-center">
          <FaFacebook className="text-3xl" />
          <p>FaceBook</p>
        </div>
        <div className="flex flex-col items-center">
          <SiGmail className="text-3xl" />
          <p>Mail</p>
        </div>
        <div className="flex flex-col items-center">
          <IoLogoApple className="text-3xl" />
          <p>AppleID</p>
        </div>
        <div className="flex flex-col items-center">
          <FaXTwitter className="text-3xl" />
          <p>Twitter</p>
        </div>
      </div>
    </form>
  );
};
