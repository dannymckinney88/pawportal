import { forwardRef, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "cta" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-primary/80 focus-visible:ring-offset-2 disabled:hover:translate-y-0 disabled:hover:shadow-none",
  secondary:
    "bg-card border border-border text-secondary-foreground hover:bg-background focus-visible:ring-primary/20",
  cta: "bg-cta text-cta-foreground hover:bg-cta-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-cta/20 disabled:hover:translate-y-0 disabled:hover:shadow-none",
  danger: "bg-danger text-danger-foreground hover:bg-danger-hover focus-visible:ring-danger/20",
};

const base =
  "min-h-11 rounded-lg px-4 py-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
  )
);

Button.displayName = "Button";
