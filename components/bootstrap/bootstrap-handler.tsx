"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";

export function BootstrapHandler() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/bootstrap", {
        method: "POST",
      });
    }
  }, [status]);

  return null;
}