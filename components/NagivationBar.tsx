import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LinkWithRoute } from "./LinkWithRoute";
import { UserInfo } from "./UserInfo";
import { MuseoModerno } from "next/font/google"

const museoModerno = MuseoModerno({
  weight: '800',
  subsets: ['latin']
})

export async function NavigationBar() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-yellow-400 text-black fixed z-40 w-full px-28 h-16">
        <div className="flex items-center mr-6">
          <span className={"font-semibold text-xl " + museoModerno.className}>Emobridge</span>
        </div>
        <div className="block">
          <ul className="flex">
            {/* <li className="mr-6">
              <LinkWithRoute href="/feedbacker" text="장애학생 페이지" />
            </li>
            <li className="mr-6">
              <LinkWithRoute href="/notetaker" text="지원인력 페이지" />
            </li>
            <li className="mr-6">
              {user ? (
                <UserInfo user={user} />
              ) : (
                <LinkWithRoute href="/auth/login" text="로그인" />
              )}
            </li> */}
          </ul>
        </div>
      </nav>
    </>
  );
}
