import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/styles/theme-provider";

export const metadata: Metadata = {
  title: "BHDS Showcase",
  description: "Side-by-side tour of BHDS 1 and BHDS 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
