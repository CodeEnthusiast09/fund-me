"use client";

import { Input } from "components/input";
import { FileInput } from "components/file-input";
import { Textarea } from "components/textarea";
import { Button } from "components/button";
import { CheckableList } from "components/checkable-list";
import { Select } from "components/select";
import { useRouter } from "next/navigation";
import { useCreateCampaign } from "hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { campaignValidationSchema } from "validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { useState } from "react";

const TextEditor = dynamic(() => import("components/text-editor"), {
  ssr: false,
});

export const Form = () => {
  const { mutate, isPending: isSubmitting } = useCreateCampaign();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InferType<typeof campaignValidationSchema>>({
    defaultValues: {
      category: [" "],
    },
    resolver: yupResolver(campaignValidationSchema),
  });

  const handleCreateCampaign: SubmitHandler<
    InferType<typeof campaignValidationSchema>
  > = (data) => mutate({ data });

  return (
    <form onSubmit={handleSubmit(handleCreateCampaign)}>
      <Input
        label="Title"
        type="text"
        placeholder="Enter title"
        error={errors?.title}
        {...register("title", { required: true })}
      />

      <FileInput
        label="Image"
        onSelectFile={(file) => setValue("headerImage", file)}
        accept="file/*"
        error={errors?.headerImage}
      />

      <Input
        label="Campaign Description"
        placeholder="Enter description"
        error={errors?.description}
        {...register("description", { required: true })}
      />

      <TextEditor
        label="Story"
        onChange={(value) => setValue("story", value)}
        placeholder="Please provide story"
        error={errors?.story}
      />

      <Input
        label="Goal"
        {...register("goal", {
          required: true,
        })}
        type="number"
        error={errors?.goal}
        showRequiredAsterik
      />

      <Input
        label="Deadline"
        {...register("deadline", {
          required: true,
        })}
        type="datetime-local"
        error={errors?.deadline}
        showRequiredAsterik
      />

      <CheckableList
        label="Category"
        selectedItems={selectedCategory}
        setSelectedItems={setSelectedCategory}
        options={[
          { label: "Education", value: "education" },
          { label: "Health Care", value: "healthcare" },
          { label: "Environment", value: "environment" },
          { label: "Disaster Relief", value: "disaster-relief" },
        ]}
        error={errors?.category}
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
