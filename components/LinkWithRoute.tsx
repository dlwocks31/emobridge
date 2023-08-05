"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LinkWithRoute({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`text-black hover:text-blue-300 ${pathname === href ? "font-bold" : ""
        }`}
    >
      {text}
    </Link>
  );
}
