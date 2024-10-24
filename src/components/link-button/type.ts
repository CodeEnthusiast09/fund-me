export type ButtonVariant = "primary" | "secondary" | "transparent";

export type ButtonProps = {
  onClick?: Function;
  variant?: ButtonVariant;
  children: React.ReactNode;
  href: string;
  className?: string;
  justifyContent?: string;
  size?: "sm" | "md" | "lg";
  radius?: string;
  target?: string;
};
