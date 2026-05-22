import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { BootstrapHandler } from "@/components/bootstrap/bootstrap-handler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Engineering Intelligence",
  description: "AI-powered GitHub engineering intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} dark`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AuthSessionProvider>
          <BootstrapHandler />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}