import { FeaturesCardProps } from "./types";
import { Card } from "components/card";

const FeaturesCard = ({
  title,
  description,
  icon: Icon,
}: FeaturesCardProps) => {
  if (!Icon) return null;
  return (
    <Card className="w-full mt-5 max-w-md border border-black">
      <div className="flex flex-col space-y-4">
        <div
          className={`w-10 h-10 rounded-full bg-darkGreen/20 flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 text-lightGreen`} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default FeaturesCard;
