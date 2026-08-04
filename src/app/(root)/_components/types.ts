import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { StaticImageData } from "next/image";
import { ElementType } from "react";

export type FeaturesCardProps = {
  title?: string;
  description?: string;
  className?: string;
  icon?: ElementType;
};

export type DonationsCardProps = {
  id?: string;
  image?: string | StaticImport;
  creator?: string;
  title?: string;
  amount?: string;
  daysLeft?: string;
  percentFunded?: number;
};
