import { NavigationBar } from "../../components/NagivationBar";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar color="bg-[#ECF1F3]" />
      <main className="flex flex-col flex-grow">{children}</main>
    </div>
  );
}
