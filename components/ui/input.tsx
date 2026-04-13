import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`border-border bg-muted text-foreground placeholder:text-hint hover:border-primary/80 focus:border-primary focus:ring-primary/20 focus:bg-background w-full rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2 ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
