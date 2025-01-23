import { GitHubProfile } from "./../../node_modules/@auth/mongodb-adapter/node_modules/@auth/core/src/providers/github";
import { GoogleProfile } from "./../../node_modules/@auth/mongodb-adapter/node_modules/@auth/core/src/providers/google";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Instagram from "next-auth/providers/instagram";
import Vk from "next-auth/providers/vk";
import Credentials from "next-auth/providers/credentials";
import client from "@/lib/db";
import { hash, compare } from "bcrypt";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Credentials({
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //     },
    //     password: {
    //       label: "Password",
    //       type: "password",
    //     },
    //   },
    //   authorize: async (credentials) => {
    //     let user = null;

    //     // logic to salt and hash password
    //     const pwHash = await hash(credentials.password, 10);

    //     // logic to verify if the user exists
    //     user = await getUserFromDb(credentials.email, pwHash);

    //     if (!user) {
    //       // No user found, so this is their first attempt to login
    //       // Optionally, this is also the place you could do a user registration
    //       throw new Error("Invalid credentials.");
    //     }

    //     // return user object with their profile data
    //     return user;
    //   },
    // }),
    Google({
      profile(profile: GoogleProfile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      profile(profile: GitHubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "user",
        };
      },
    }),
    Instagram,
    Vk,
  ],
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.DB_NAME,
  }),
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session;
    },
    authorized: async ({ request, auth }) => {
      const url = request.nextUrl;
      if (url.href.includes("create") && !auth) {
        return false;
      }
      return !!auth;
    },
  },
});
