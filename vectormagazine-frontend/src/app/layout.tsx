import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import FloatingFollow from "@/components/layout/FloatingFollow";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MOW Creative Magazine",
    template: "%s | MOW Creative Magazine",
  },
  description: "A creative magazine template for modern storytelling.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vectormagazine.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'MOW Creative Magazine',
    title: 'MOW Creative Magazine',
    description: 'A creative magazine template for modern storytelling.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MOW Creative Magazine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOW Creative Magazine',
    description: 'A creative magazine template for modern storytelling.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LeftSidebar />
          <RightSidebar />
          <FloatingFollow />
          <div className=" min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
