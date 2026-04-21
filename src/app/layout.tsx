import type { Metadata } from "next";
import { Figtree, Mulish } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/styles/theme-provider";

const fontMulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

const fontFigtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BHDS Rebranding Toolkit",
  description: "Side-by-side tour of BHDS 1 and BHDS 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontMulish.variable} ${fontFigtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
