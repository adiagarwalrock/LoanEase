import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "LoanEase | Free Amortization Calculator",
  description: "Generate detailed amortization schedules for any loan. Easily calculate payments, visualize your payoff journey, and plan your financial future with our free, intuitive tool.",
  keywords: ["loan calculator", "amortization schedule", "mortgage calculator", "loan payment calculator", "interest calculator", "financial planning"],
  authors: [{ name: "AI Engineer" }],
  creator: "AI Engineer",
  publisher: "Firebase",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LoanEase | Free Amortization Calculator",
    description: "Effortlessly create and analyze loan amortization schedules. Perfect for mortgages, car loans, and personal loans.",
    url: "https://loanease.example.com", // Replace with your actual domain
    siteName: "LoanEase",
    images: [
      {
        url: "/og-image.png", // Make sure to add an og-image.png to your public folder
        width: 1200,
        height: 630,
        alt: "LoanEase Amortization Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanEase | Free Amortization Calculator",
    description: "Plan your loan payments with ease. Generate detailed amortization schedules and visualize your financial future.",
    images: ["/og-image.png"], // Make sure to add an og-image.png to your public folder
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
