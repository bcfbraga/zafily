import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zafily — All your affiliate tools in one place",
  description: "Connect links, products, and platforms to organize, track, and grow your affiliate business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
