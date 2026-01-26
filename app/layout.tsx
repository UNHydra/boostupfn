import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BoostUP — Fortnite Boosting and Coaching Services",
  description: "Secure Fortnite boosting, cheap V-Bucks, and coaching with fast delivery and 24/7 Discord support.",
  metadataBase: new URL("https://www.boostupfn.com"), // ← domain gelince burayı değiştir
  openGraph: {
    title: "BoostUP — Fortnite Boosting and Coaching Services",
    description:
      "Secure Fortnite boosting, cheap V-Bucks, and coaching with fast delivery and 24/7 Discord support.",
    url: "https://www.boostupfn.com",
    siteName: "BoostUP",
    images: [
      {
        url: "/og.png", // ← public/og.png
        width: 1200,
        height: 630,
        alt: "BoostUP — Fortnite Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoostUP — Fortnite Boosting and Coaching Services",
    description:
      "Secure Fortnite boosting, cheap V-Bucks, and coaching with fast delivery and 24/7 Discord support.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden bg-black text-white">
  {/* ✅ GLOBAL PREMIUM BACKGROUND LAYERS */}
  <div className="pointer-events-none absolute inset-0">
    {/* üst çizgi */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

    {/* ana violet glow (navbar + hero arkası) */}
    <div className="absolute -top-24 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-violet-500/12 blur-3xl" />

    {/* sağ üst ikinci glow */}
    <div className="absolute -top-10 right-[-140px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

    {/* hafif vignette (kenar karartma) */}
    <div className="absolute inset-0 bg-[radial-gradient(1100px_500px_at_50%_-60px,rgba(255,255,255,0.10),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_50%_120%,rgba(139,92,246,0.10),transparent_55%)]" />

    {/* çok hafif grid hissi */}
    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
  </div>

  <Navbar />
  <main className="relative mx-auto max-w-6xl px-4 py-10">{children}</main>
  <Footer />
</body>


    </html>
  );
}
