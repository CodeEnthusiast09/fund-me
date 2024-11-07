"use client";

import { Input } from "components/input";
import { MaskPasswordInput } from "components/mask-password-input";
import { Button } from "components/button";
import Link from "next/link";
import { useSignIn } from "hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaFacebook } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { IoLogoApple } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

export const LoginForm = () => {
  const { mutate: signIn, isPending: isSubmitting } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const handleLogin: SubmitHandler<InferType<typeof loginValidationSchema>> = (
    data
  ) => signIn({ data });

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Input
        label="Email"
        type="text"
        placeholder="Enter email"
        error={errors.email}
        {...register("email", { required: true })}
      />
      <div className="relative">
        <MaskPasswordInput
          label="Password"
          placeholder="Enter Password"
          error={errors.password}
          {...register("password", { required: true })}
        />

        <div className="text-lg py-3 flex justify-start items-center">
          <Link className="text-primary-300" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
      <div className="pt-5">
        <Button
          type="submit"
          variant="primary"
          className=" block w-full cursor-pointer"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>

        <div className="text-lg py-3 flex justify-start items-center">
          <p>New here?&nbsp;</p>
          <Link className="underline" href="/auth/sign-up">
            Sign Up
          </Link>
        </div>
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
