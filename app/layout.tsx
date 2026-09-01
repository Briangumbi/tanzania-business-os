import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://tanzania-business-os.vercel.app";
const description =
  "A ledger-first business operating system for informal retailers in Tanzania — starting with credit and debt tracking.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tanzania Business OS",
  description,
  openGraph: {
    title: "Tanzania Business OS",
    description,
    url: siteUrl,
    siteName: "Tanzania Business OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanzania Business OS",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
