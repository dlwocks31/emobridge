"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
  const supabase = createClientComponentClient();
  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:3000`;
  return (
    <div className="card w-96 self-center bg-base-100 shadow-xl p-12 m-8">
      <div className="text-center font-bold">Emobridge 로그인 하기</div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        showLinks={false}
        providers={["google"]}
        redirectTo={`${host}/auth/callback`}
        onlyThirdPartyProviders={true}
      />
    </div>
  );
}
