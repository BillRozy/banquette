"use server";

import { actionClient } from "../services/action-client";
import { signOut as signOutAuth } from "../auth";
import { getLocale } from "next-intl/server";
import { createFailureResponse, createSuccessResponse } from "./utils";

export const signOut = actionClient.action(async () => {
  const locale = await getLocale();
  try {
    await signOutAuth({
      redirectTo: `/${locale}/signin`,
      redirect: true,
    });
    return createSuccessResponse("You were signed out");
  } catch (err) {
    return createFailureResponse("Can't signed you out", err as Error);
  }
});
