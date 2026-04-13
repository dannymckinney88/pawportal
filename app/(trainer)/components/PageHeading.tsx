import { forwardRef, type ReactNode } from "react";

type PageHeadingProps = {
  children: ReactNode;
  className?: string;
  tabIndex?: number;
};

export const PageHeading = forwardRef<HTMLHeadingElement, PageHeadingProps>(
  ({ children, className }) => {
    return <h1 className={className}>{children}</h1>;
  }
);

PageHeading.displayName = "PageHeading";
