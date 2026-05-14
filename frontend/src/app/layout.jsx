import { Manrope, Outfit } from "next/font/google";
import ReduxProvider from "@/providers/redux-provider";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const headingFont = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "SIP Investor Dashboard",
  description: "SIP investor analytics with live portfolio insights.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[var(--text)]">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
