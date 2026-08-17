import * as React from "react";
import { Manrope } from "next/font/google";

import "./globals.css";

import RootLayoutClient from "@/components/layout/RootLayoutClient";

import type { Metadata } from "next";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraTours - Premium Travel Planning",
  description: "Discover curated travel plans and seamless tour bookings with our high-fidelity, interactive platform.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="h-full antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
