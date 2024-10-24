export type FileInputProps = {
  onChange?: (e: any) => void;
  onSelectFile?: (e: File) => void;
  onSelectMultipleFiles?: (e: File[]) => void;
  label?: string;
  labelClassName?: string;
  className?: string;
  name?: string;
  accept?: string;
  error?: {
    message?: string;
  };
  labelRightHint?: string;
  placeholder?: string;
  showRequiredAsterik?: boolean;
  multiple?: boolean;
};
