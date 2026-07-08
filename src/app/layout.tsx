import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "LG Remote",
  description: "Premium LG webOS Remote Web App",
  appleWebApp: {
    capable: true,
    title: "LG Remote",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
