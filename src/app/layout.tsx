import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAT100",
  description: "Invoicing for freelancers and studios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
