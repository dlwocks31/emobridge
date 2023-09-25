import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { MuseoModerno } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { DocSave } from "./DocSave";
import { EmojiOpenBtn } from "./EmojiOpenBtn";
import { UserInfo } from "./UserInfo";

const museoModerno = MuseoModerno({
  weight: "800",
  subsets: ["latin"],
});

export async function NavigationBar({
  color,
  to,
}: {
  color: string;
  to: "editor" | "feedbacker";
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  return (
    <>
      <nav
        className={
          "flex items-center justify-between p-4 text-black z-40 w-full px-28 h-16 " +
          color
        }
      >
        <div className="block">
          <ul className="flex">
            <li className="mr-6">
              <EmojiOpenBtn />
            </li>
          </ul>
        </div>
        <div className="flex items-center mr-6">
          <Link href={`/${to}/course`}>
            <span className={"font-semibold text-xl " + museoModerno.className}>
              Emobridge
            </span>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="mr-6">
            <DocSave />
          </div>
          <div className="mr-6">
            <UserInfo user={user} />
          </div>
        </div>
      </nav>
    </>
  );
}
