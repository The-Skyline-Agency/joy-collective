import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Joy Collective",
  description:
    "Small groups of women, real conversations about the hard stuff, and the little moments of joy that help us find our way back.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
