import { NavigationBar } from "@/components/NagivationBar";
import "./globals.css";
export const metadata = {
  title: "Emobridge",

  description: "Emobridge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        <main className="flex min-h-screen flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
