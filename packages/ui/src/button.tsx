import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "nexsmsid-button nexsmsid-button-primary",
  secondary: "nexsmsid-button nexsmsid-button-secondary"
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  const classes = [variantClassName[variant], className].filter(Boolean).join(" ");

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
