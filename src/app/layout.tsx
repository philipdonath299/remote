import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LG Remote",
  description: "Premium LG webOS Remote Web App",
  appleWebApp: {
    capable: true,
    title: "LG Remote",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
