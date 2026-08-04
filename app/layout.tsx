import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect Vibe Co — Find your people",
  description:
    "Local meetups, weekend trips, and nights out — vetted, bookable, and full of strangers worth meeting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-white antialiased">{children}</body>
    </html>
  );
}
