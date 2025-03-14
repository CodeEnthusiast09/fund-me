import type { Metadata } from "next";
// import { satoshi } from "app/fonts";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "lib/constants";

export const metadata: Metadata = {
  title: "fundlyNest",
  description: "Online Fundraising for Any Event, Anytime, Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Providers>
          <Toaster {...TOASTER_PROPS} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
