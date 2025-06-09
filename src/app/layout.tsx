import { Roboto } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ReduxProvider } from "@/redux/provider";

const roboto = Roboto({
  variable: "--font-roboto-sans",
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <ReduxProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
