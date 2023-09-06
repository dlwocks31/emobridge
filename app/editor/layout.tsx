import { NavigationBar } from "../../components/NagivationBar";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar color="bg-[#ECF1F3]" to="editor" />
      <main className="flex flex-col flex-grow px-28 py-2">{children}</main>
    </div>
  );
}
