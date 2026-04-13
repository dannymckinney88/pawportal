import { forwardRef, type ReactNode } from "react";

type PageHeadingProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
};

export const PageHeading = forwardRef<HTMLHeadingElement, PageHeadingProps>(
  ({ children, className, id, tabIndex }, ref) => {
    return (
      <h1 ref={ref} id={id} tabIndex={tabIndex} className={className}>
        {children}
      </h1>
    );
  }
);

PageHeading.displayName = "PageHeading";
