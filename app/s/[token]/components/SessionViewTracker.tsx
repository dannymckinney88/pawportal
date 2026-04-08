"use client";

import { useEffect } from "react";

type SessionViewTrackerProps = {
  token: string;
};

export const SessionViewTracker = ({ token }: SessionViewTrackerProps) => {
  useEffect(() => {
    void fetch(`/api/sessions/${token}/view`, {
      method: "POST",
      cache: "no-store",
    });
  }, [token]);

  return null;
};
