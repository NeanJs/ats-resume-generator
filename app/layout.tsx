import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ApplyCraft — AI Resume Optimizer",
    template: "%s | ApplyCraft",
  },
  description:
    "Paste a job description. ApplyCraft rewrites your resume to match it — ATS score, missing keywords, tailored bullets, and a cover letter in 30 seconds.",
  keywords: [
    "resume optimizer",
    "ATS resume checker",
    "AI resume writer",
    "cover letter generator",
    "job application tool",
    "ApplyCraft",
  ],
  metadataBase: new URL(process.env.BASE_URL ?? "https://applycraft.xyz"),
  openGraph: {
    title: "ApplyCraft — AI Resume Optimizer",
    description:
      "Rewrite your resume for any job in 30 seconds. ATS score, missing keywords, tailored bullets, cover letter.",
    url: "/",
    siteName: "ApplyCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyCraft — AI Resume Optimizer",
    description:
      "Rewrite your resume for any job in 30 seconds. ATS score, missing keywords, tailored bullets, cover letter.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
          <main className="flex-1">{children}</main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
