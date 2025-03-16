"use client";
import { useTranslations } from "next-intl";
import React, { Suspense } from "react";
import { Button } from "../../../../components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useAction } from "next-safe-action/hooks";

export default function SignoutForm({ className }: { className?: string }) {
  const t = useTranslations("SignOut");
  const { execute } = useAction(signOut);

  return (
    <Suspense>
      <div className={className}>
        <form action={() => execute()}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start p-0 px-1"
          >
            <LogOutIcon size={24} />
            {t("title")}
          </Button>
        </form>
      </div>
    </Suspense>
  );
}
