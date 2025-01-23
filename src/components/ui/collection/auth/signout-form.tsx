import { useTranslations } from "next-intl";
import React, { Suspense } from "react";
import { signOut } from "@/app/auth";
import { Button } from "../../button";
import { LogOutIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

export default async function SignoutForm({}: {}) {
  const t = useTranslations("SignOut");
  const locale = await getLocale();

  return (
    <Suspense>
      <div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: `/${locale}/signin`, redirect: true });
          }}
        >
          <Button type="submit" variant="ghost" className="w-full">
            <LogOutIcon size={24} />
            {t("title")}
          </Button>
        </form>
      </div>
    </Suspense>
  );
}
