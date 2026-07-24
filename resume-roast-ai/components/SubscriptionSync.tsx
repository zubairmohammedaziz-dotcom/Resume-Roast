"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const PLAN_KEY = "offernhire_plan";
const RELOAD_KEY = "offernhire_pro_reload_done";

export default function SubscriptionSync() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem(PLAN_KEY);
      sessionStorage.removeItem(RELOAD_KEY);
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    let cancelled = false;

    async function checkSubscription() {
      try {
        const response = await fetch("/api/subscription/status", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          console.error(
            "Subscription status request failed:",
            response.status
          );
          return;
        }

        const data = (await response.json()) as {
          isPro?: boolean;
        };

        if (cancelled) {
          return;
        }

        if (data.isPro === true) {
          const wasAlreadyPro =
            localStorage.getItem(PLAN_KEY) === "pro";

          localStorage.setItem(PLAN_KEY, "pro");

          window.dispatchEvent(
            new CustomEvent("offernhire-plan-updated", {
              detail: { plan: "pro" },
            })
          );

          /*
           * Existing components read Pro access synchronously from
           * localStorage. Reload once after the first successful sync
           * so every component immediately recognizes the paid plan.
           */
          const alreadyReloaded =
            sessionStorage.getItem(RELOAD_KEY) === "true";

          if (!wasAlreadyPro && !alreadyReloaded) {
            sessionStorage.setItem(RELOAD_KEY, "true");
            window.location.reload();
          }
        } else {
          localStorage.removeItem(PLAN_KEY);
          sessionStorage.removeItem(RELOAD_KEY);

          window.dispatchEvent(
            new CustomEvent("offernhire-plan-updated", {
              detail: { plan: "free" },
            })
          );
        }
      } catch (error) {
        console.error("Subscription synchronization failed:", error);
      }
    }

    void checkSubscription();

    const refreshSubscription = () => {
      void checkSubscription();
    };

    window.addEventListener("focus", refreshSubscription);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshSubscription);
    };
  }, [status]);

  return null;
}