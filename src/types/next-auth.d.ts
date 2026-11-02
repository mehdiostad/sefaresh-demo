import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: AppUser
  }
  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AppUser {}
}
