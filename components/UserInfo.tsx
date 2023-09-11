"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const UserInfo = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  if (user) {
    return (
      <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a>{user.email}</a>
          </li>
          <li
            onClick={async () => {
              await supabase.auth.signOut();
              router.refresh();
            }}
          >
            <a>로그아웃</a>
          </li>
        </ul>
        <label tabIndex={0}>
          <Image src="/user.png" alt="user" width="24" height="24" />
        </label>
      </div>
    );
  } else {
    return (
      <div
        className="tooltip tooltip-bottom"
        data-tip="로그인"
        onClick={() => router.push("/auth/login")}
      >
        <Image src="/user.png" alt="user" width="24" height="24" />
      </div>
    );
  }
};
