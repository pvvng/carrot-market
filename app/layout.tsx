import type { Metadata } from "next";
import "./globals.css";

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
        className={`antialiased bg-neutral-900 max-w-screen-sm mx-auto text-white`}
      >
        {children}
      </body>
    </html>
  );
}
