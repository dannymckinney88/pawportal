import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pawportal-xi.vercel.app"),
  title: {
    default: "HeelFlow",
    template: "%s | HeelFlow",
  },
  description:
    "HeelFlow is a mobile-first dog training follow-up app that helps private trainers share session recaps, assign homework, track progress, and stay connected with clients between sessions.",
  applicationName: "HeelFlow",
  keywords: [
    "dog training",
    "dog trainer",
    "client homework",
    "session recap",
    "pet training",
    "private dog trainer",
    "trainer workflow",
    "dog training app",
  ],
  authors: [{ name: "Danny McKinney" }],
  creator: "Danny McKinney",
  publisher: "HeelFlow",
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    title: "HeelFlow",
    description:
      "A mobile-first dog training follow-up app for private trainers to share recaps, assign homework, and keep clients engaged between sessions.",
    siteName: "HeelFlow",
    url: "https://pawportal-xi.vercel.app",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "HeelFlow logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "HeelFlow",
    description: "A mobile-first dog training follow-up app for private trainers.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
