import type { Metadata } from "next";
import {
  Cantarell,
  Geist,
  Geist_Mono,
} from "next/font/google";

import { Header } from "@/components/Header";

import "./globals.css";

const cantarell = Cantarell({
  variable: "--font-cantarell",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const bebasNeue = Bebas_Neue({
//   variable: "--font-bebas",
//   weight: "400",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Next Offer",
  description: "Practice interviews, improve your skills, and prepare for your next offer",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body
  className={`${geistSans.variable} ${geistMono.variable} ${cantarell.variable}`}
>        <Header />
        {children}
      </body>
    </html>
  );
}
