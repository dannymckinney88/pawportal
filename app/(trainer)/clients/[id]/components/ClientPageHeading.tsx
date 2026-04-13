import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
};

/** Presentational h1 for the client detail page. No focus side-effects. */
export const ClientPageHeading = ({ children, className, id, tabIndex }: Props) => (
  <h1 id={id} tabIndex={tabIndex} className={className}>
    {children}
  </h1>
);
