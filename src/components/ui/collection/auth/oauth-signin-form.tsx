import { useTranslations } from "next-intl";
import React from "react";
import { signIn } from "@/app/auth";
import { Button } from "../../button";
import Image from "next/image";

export default function OauthSigninForm({
  icon,
  provider,
}: {
  icon: string;
  provider: string;
}) {
  const t = useTranslations("SignIn");

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn(provider, { redirectTo: "/" });
        }}
      >
        <Button type="submit" size="lg" className="w-full">
          <Image height={24} width={24} src={icon} alt={t(`${provider}.alt`)} />
          {t(`${provider}.title`)}
        </Button>
      </form>
    </div>
  );
}
