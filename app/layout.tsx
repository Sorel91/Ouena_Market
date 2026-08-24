import type { Metadata } from "next";
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
  title: "Kôrô Marché | Épicerie en ligne au Mali",
  description: "Les essentiels du quotidien, commandés en ligne et livrés simplement.",
  openGraph: {
    title: "Kôrô Marché | Épicerie en ligne au Mali",
    description: "Les essentiels du quotidien, commandés en ligne et livrés simplement.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kôrô Marché | Épicerie en ligne au Mali",
    description: "Les essentiels du quotidien, commandés en ligne et livrés simplement.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
