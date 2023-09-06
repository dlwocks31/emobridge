import { NavigationBar } from "../../components/NagivationBar";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar color="bg-yellow-400" />
      <main className="flex flex-col items-center justify-center flex-grow mt-20">
        {children}
      </main>
    </>
  );
}
