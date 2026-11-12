import type { Metadata } from "next";
import "./globals.css"; // این خط خیلی مهم است

export const metadata: Metadata = {
  title: "NIKOU Marketplace",
  description: "B2B Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}