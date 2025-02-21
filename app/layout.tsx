import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Sigmar } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sigmar = Sigmar({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  // class 이름 설정
  variable: "--sigmar-boy",
});

const roboto = Roboto({
  variable: "--roboto-text",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

// local font 사용하기
const metalica = localFont({
  src: "./metalica.ttf",
  variable: "--metalica-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Carrot-Market",
    default: "Carrot-Market",
  },
  description: "sell and buy all things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sigmar.variable} ${roboto.variable} ${metalica.variable} antialiased bg-neutral-900 max-w-screen-sm mx-auto text-white`}
      >
        {children}
      </body>
    </html>
  );
}
