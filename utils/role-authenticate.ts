import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import path from "path";
import { Database } from "../database.types";

export async function roleAuthenticate(
  pathSuffix: string,
  desired: "editor" | "feedbacker",
) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email;

  if (!user || !userEmail) {
    redirect("/auth/login");
  }
  console.log(userEmail);

  const { data } = await supabase
    .from("userRoles")
    .select("*")
    .eq("userEmail", userEmail)
    .single();

  if (!data) {
    console.log("roleAuthenticate: User has no role");
    // admin user
    return user;
  }

  if (!["editor", "feedbacker"].includes(data.userRole)) {
    console.warn(
      `roleAuthenticate: User ${userEmail} has invalid role ${data.userRole}`,
    );
    return user;
  }
  if (data.userRole === desired) {
    console.log(`User ${userEmail} has correct role ${data.userRole}`);
    // user has correct role
    return user;
  }
  console.log(
    `roleAuthenticate: User ${userEmail} has incorrect role ${data.userRole}`,
  );
  redirect(path.join("/", data.userRole, pathSuffix));
}
