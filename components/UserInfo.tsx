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
  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={user ? `${user.email} / 로그아웃` : "로그인"}
      onClick={async () => {
        if (user) {
          await supabase.auth.signOut();
          router.refresh();
        } else {
          router.push("/auth/login");
        }
      }}
    >
      <Image src="/user.png" alt="user" width="24" height="24" />
    </div>
  );
};
