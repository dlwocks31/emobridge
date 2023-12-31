import { NavigationBar } from "../../components/NagivationBar";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar color="bg-yellow-400 fixed" to="feedbacker" />
      <main className="flex flex-col flex-grow px-28 pt-20 pb-2">{children}</main>
    </div>
  );
}
