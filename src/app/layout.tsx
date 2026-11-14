import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: {
    default: "بازارگاه نیکو | بازارگاه جامع تجارت B2B",
    template: "%s | بازارگاه نیکو"
  },
  description: "بازارگاه جامع تجارت نیکو، بستری امن و حرفه‌ای برای اتصال خریداران و فروشندگان عمده در سراسر کشور است. معامله عمده با تضمین کیفیت و امنیت.",
  keywords: ["بازارگاه", "تجارت عمده", "B2B", "خرید عمده", "فروش عمده", "نیکو", "بازار اینترنتی"],
  authors: [{ name: "NIKOU Marketplace" }],
  openGraph: {
    title: "بازارگاه نیکو | بازارگاه جامع تجارت B2B",
    description: "اتصال امن خریداران و فروشندگان در بزرگترین انبار مجازی ایران.",
    url: "https://nikou-marketplace.vercel.app",
    siteName: "بازارگاه نیکو",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بازارگاه نیکو",
    description: "بازارگاه جامع تجارت B2B",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}