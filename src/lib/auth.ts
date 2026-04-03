import type { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "@/contexts/AuthContext";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://admin.beautycareskin.com/api/v1";

interface SocialLoginResponse {
  token?: string;
  data?: User;
  message?: string;
}

async function callSocialLogin(
  provider: string,
  accessToken: string
): Promise<{ backendToken: string; backendUser: User } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/customer/social-login/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    });
    const data: SocialLoginResponse = await res.json().catch(() => ({}));
    if (res.ok && data.token && data.data) {
      return { backendToken: data.token, backendUser: data.data };
    }
    return null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token && account.provider) {
        const result = await callSocialLogin(account.provider, account.access_token);
        if (result) {
          token.backendToken = result.backendToken;
          token.backendUser = result.backendUser;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.backendUser = token.backendUser;
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
