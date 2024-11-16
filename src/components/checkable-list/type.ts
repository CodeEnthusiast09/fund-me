import { Dispatch, SetStateAction } from "react";

export type Option = {
  value: string;
  label: string;
};
export interface CheckableListProps {
  options: Option[];
  selectedItems?: string[];
  label: string;
  labelClassName?: string;
  showRequiredAsterik?: boolean;
  setSelectedItems?: Dispatch<SetStateAction<string[]>>;
  error?: {
    message?: string;
  };
}
