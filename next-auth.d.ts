import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Adding the new field to the User interface
  interface User extends DefaultUser {
    role: "user" | "admin" | "moderator";
  }

  // Here I add the user object to the session object so I can access it easily.
  interface Session extends DefaultSession {
    user: User;
  }
}
