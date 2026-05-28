import { AppAnalytics } from "@/components/analytics/app-analytics";
import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExamAITutor",
  description: "Practice JAMB/UTME questions with post-answer AI tutoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans antialiased",
        geistMono.variable,
        outfit.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AppAnalytics />
      </body>
    </html>
  );
}
