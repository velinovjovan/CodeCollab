import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CodeCollab",
  description:
    "CodeCollab: Connect, Collaborate, Create. Live chat with fellow developers and showcase your projects online. Build your network, share your work, and find inspiration in a community designed for coders. Join CodeCollab today!",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/codecollab.png" sizes="any" />
      </head>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
