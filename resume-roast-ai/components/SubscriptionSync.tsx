"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { syncProStatus } from "@/lib/freeLimits";

export default function SubscriptionSync() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    void syncProStatus();

    const refreshSubscription = () => {
      void syncProStatus();
    };

    window.addEventListener("focus", refreshSubscription);

    return () => {
      window.removeEventListener("focus", refreshSubscription);
    };
  }, [status]);

  return null;
}