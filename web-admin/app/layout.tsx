import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.built.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CGM Device Management System",
  description: "Comprehensive management system for CGM devices, orders, and users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function applyTheme() {
                  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (isDark) {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                }
                applyTheme();
                window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased text-foreground bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
