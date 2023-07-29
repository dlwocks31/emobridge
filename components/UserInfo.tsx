"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export const UserInfo = ({ user }: { user: User }) => {
  const supabase = createClientComponentClient();
  return (
    <div
      className="cursor-pointer text-white hover:text-blue-300"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
    >
      {user.email}
    </div>
  );
};
