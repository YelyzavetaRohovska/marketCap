import type { Metadata } from "next";
import "../styles/globals.css";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><ErrorBoundary errorComponent={<Error />}>{children}</ErrorBoundary></body>
    </html>
  );
}
