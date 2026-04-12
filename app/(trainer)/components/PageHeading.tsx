"use client";

import { useEffect, useRef } from "react";

/**
 * Page-level h1 that receives programmatic focus on mount.
 *
 * tabIndex={-1} keeps it out of the normal tab order — it is only ever
 * focused via useEffect, not by keyboard navigation. This gives screen
 * reader users an immediate orientation point after SPA navigation without
 * polluting the tab sequence.
 */
export function PageHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <h1 ref={ref} tabIndex={-1} className={className}>
      {children}
    </h1>
  );
}
