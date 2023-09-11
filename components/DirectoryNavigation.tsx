import Link from "next/link";
import React from "react";

export function DirectoryNavigation({
  directories,
}: {
  directories: {
    name: string;
    href?: string;
  }[];
}) {
  return (
    <div className="flex gap-1">
      {directories.map((d, index) => (
        <React.Fragment key={d.name}>
          {d.href ? (
            <Link
              className="btn btn-ghost h-[fit-content] min-h-[fit-content] p-1"
              href={d.href}
            >
              <div>{d.name}</div>
            </Link>
          ) : (
            <div className="btn btn-ghost h-[fit-content] min-h-[fit-content] p-1">
              <div>{d.name}</div>
            </div>
          )}
          {index < directories.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
