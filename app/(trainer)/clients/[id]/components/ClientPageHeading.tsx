import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Presentational h1 for the client detail page. No focus side-effects. */
export const ClientPageHeading = ({ children, className }: Props) => (
  <h1 className={className}>{children}</h1>
);
