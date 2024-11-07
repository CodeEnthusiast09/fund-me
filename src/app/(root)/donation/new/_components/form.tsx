"use client";

import { Input } from "components/input";
import { Textarea } from "components/textarea";
import TextEditor from "components/text-editor";
import { Button } from "components/button";
import { Select } from "components/select";
import { useRouter } from "next/navigation";
import { useSignUp } from "hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const Form = () => {
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
        label="Title"
        type="text"
        placeholder="Enter title"
        error={errors?.firstname}
        {...register("firstname", { required: true })}
      />
      <Textarea
        label="Campaign Description"
        placeholder="Enter description"
        error={errors?.lastname}
        {...register("lastname", { required: true })}
      />
      <TextEditor
        label="Story"
        onChange={(value) => setValue("email", value)}
        placeholder="Please provide story"
        error={errors?.email}
      />

      <Input
        label="Goal"
        {...register("gender", {
          required: true,
        })}
        type="number"
        error={errors?.gender}
        showRequiredAsterik
      />

      <Input
        label="Deadline"
        {...register("gender", {
          required: true,
        })}
        type="datetime-local"
        error={errors?.gender}
        showRequiredAsterik
      />

      <Select
        label="Category"
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
