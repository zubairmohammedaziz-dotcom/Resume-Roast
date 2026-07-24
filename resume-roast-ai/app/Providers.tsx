"use client";

import { SessionProvider } from "next-auth/react";

import SubscriptionSync from "@/components/SubscriptionSync";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SubscriptionSync />
      {children}
    </SessionProvider>
  );
}