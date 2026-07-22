import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "./(marketing)/_providers/smooth-scroll-provider";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OWN KARMA — Not Bound. Unbound.",
    template: "%s · OWN KARMA",
  },
  description:
    "OWN KARMA is a philosophy expressed through design. Every piece begins with an idea. Every symbol carries meaning. Every design tells a story.",
  applicationName: "OWN KARMA",
  keywords: [
    "OWN KARMA",
    "unbound",
    "fashion philosophy",
    "design universe",
    "sacred geometry",
    "karma archive",
  ],
  authors: [{ name: "OWN KARMA" }],
  openGraph: {
    title: "OWN KARMA — Not Bound. Unbound.",
    description:
      "You are not entering a brand. You are entering an idea. Discover the OWN KARMA universe.",
    type: "website",
    siteName: "OWN KARMA",
  },
  twitter: {
    card: "summary_large_image",
    title: "OWN KARMA — Not Bound. Unbound.",
    description:
      "A philosophy expressed through design. Enter the OWN KARMA universe.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${serif.variable} ${sans.variable} bg-ink text-ivory antialiased`}
        suppressHydrationWarning
      >
        {/* Skip-to-content link — WCAG 2.4.1 keyboard bypass block */}
        <a href="#the-void" className="skip-to-content">
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

