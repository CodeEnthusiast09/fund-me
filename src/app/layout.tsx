import type { Metadata } from "next";
import { satoshi } from "app/fonts";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Fund Me",
  description: "Online Fundraising for Any Event, Anytime, Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.className} antialiased bg-lightGray`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
