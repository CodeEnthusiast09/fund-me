export interface TextEditorProps {
  label?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  error?: {
    message?: string;
  };
  className?: string;
  ariaLabel?: string;
  labelClassName?: string;
  value?: string | number;
  showRequiredAsterik?: boolean;
  defaultValue?: string;
}
