import "./globals.css";
import { Providers } from "./providers";
export const metadata = {
  title: "Emobridge",
  description: "Emobridge",
};

export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
