import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celer - The World's First End-to-End Multiomics Copilot",
  description: "Pull, analyze, and visualize complex biological data — all in one intelligent platform.",
  icons: {
    icon: "/c-logo-3d-purple-black-2048.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
