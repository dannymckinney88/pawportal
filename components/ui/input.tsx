import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-hint outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background ${className}`}
      {...props}
    />
  ),
);

Input.displayName = "Input";
