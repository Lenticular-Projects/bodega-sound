import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Bodega Sound | Underground Collective",
  description:
    "Quarterly sonic experiences. International DJs. Secret locations. Manila's underground dance music collective.",
  keywords: [
    "Bodega Sound",
    "Manila",
    "underground",
    "house music",
    "techno",
    "dance",
    "party",
    "Contrabanda",
  ],
  openGraph: {
    title: "Bodega Sound | Underground Collective",
    description:
      "Quarterly sonic experiences. International DJs. Secret locations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="grain-overlay" />
        <ThemeProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="relative min-h-screen bg-transparent">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
