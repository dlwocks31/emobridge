import { NavigationBar } from "@/components/NagivationBar";
import "./globals.css";
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
        <NavigationBar />
        <main className="flex flex-col items-center justify-center flex-grow mt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
