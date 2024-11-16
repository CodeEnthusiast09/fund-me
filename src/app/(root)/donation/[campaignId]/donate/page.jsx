import { PageTitle } from "components/page-title";
import Form from "./_components/form";

const Page = () => {
  return (
    <div className="m-5 lg:m-9">
      <div className="text-center">
        <PageTitle
          title="Donate to a fundNest Campaign"
          description="Complete the following steps to donate to a campaign"
        />
      </div>

      <Form />
    </div>
  );
};

export default Page;
