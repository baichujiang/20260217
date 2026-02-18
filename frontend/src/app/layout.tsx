import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { ApiConfigBanner } from "@/components/ApiConfigBanner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LeafMiles",
    description: "LeafMiles",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ApiConfigBanner />
        <Script src="/env-config.js" strategy="beforeInteractive" />
        <Script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAfOZJfaDoziqXz5FmBjAnVl4ZHWokw-js`}
            strategy="beforeInteractive"
        />

        {children}
        <Toaster position="top-center" />
        </body>
        </html>
    );
}
