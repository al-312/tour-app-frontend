import * as React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { RootLayoutClient } from "@/components/layout/root-layout-client";

import { Providers } from "./providers";

import type { Metadata } from "next";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuraTours — Curated Private Itineraries",
  description: "Bespoke luxury tour & expedition curation platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="font-sans bg-app-bg text-app-fg antialiased min-h-screen selection:bg-app-brand/20">
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
