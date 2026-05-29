import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kioskoman — AI-native studio for high-growth startups",
  description:
    "AI-native studio building brands and web experiences for high-growth startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0a] text-[#f7f5ef]">
        {children}
      </body>
    </html>
  );
}
