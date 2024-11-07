"use client";
import { PageTitle } from "components/page-title";
import { Form } from "./_components/form";

const Page = () => {
  return (
    <div className="m-5 lg:m-9">
      <div className="text-center">
        <PageTitle
          title="Start a fundNest Campaign"
          description="Complete the following steps to create your campaign"
        />
      </div>

      <Form />
    </div>
  );
};

export default Page;
