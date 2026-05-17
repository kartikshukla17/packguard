import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PackGuard — Stop shipping your AI assistant's secrets",
  description:
    "428 npm packages contain AI assistant config files. 33 had live API keys. PackGuard hooks into prepublishOnly and blocks them before they ship.",
  metadataBase: new URL("https://packguard.kartikshukla.dev"),
  openGraph: {
    title: "PackGuard — Stop shipping your AI assistant's secrets",
    description: "428 packages. 33 leaking live keys. One line to fix it.",
    url: "https://packguard.kartikshukla.dev",
    siteName: "PackGuard",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PackGuard — Stop shipping your AI assistant's secrets",
    description: "428 packages. 33 leaking live keys. One line to fix it.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366F1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
