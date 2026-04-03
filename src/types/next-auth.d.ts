import type { User } from "@/contexts/AuthContext";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    backendUser?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    backendUser?: User;
  }
}
