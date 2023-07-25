"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationBar() {
  const pathname = usePathname();
  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-blue-500">
        <div className="flex items-center text-white mr-6">
          <span className="font-semibold text-xl">Emobridge</span>
        </div>
        <div className="block">
          <ul className="flex">
            <li className="mr-6">
              <Link
                href="/feedbacker"
                className={`text-white hover:text-blue-300 ${
                  pathname === "/feedbacker" ? "font-bold" : ""
                }`}
              >
                장애학생 페이지
              </Link>
            </li>
            <li className="mr-6">
              <Link
                href="/notetaker"
                className={`text-white hover:text-blue-300 ${
                  pathname === "/notetaker" ? "font-bold" : ""
                }`}
              >
                지원인력 페이지
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
