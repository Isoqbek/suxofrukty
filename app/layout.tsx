import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Сухофрукти — свіжі та натуральні",
  description: "Інтернет-магазин сухофруктів та горіхів з доставкою по Україні",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
