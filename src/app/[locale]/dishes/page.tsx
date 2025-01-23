import { Button } from "@/components/ui/button";
import DishesOverview from "@/components/ui/dish/overview";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import React, { Suspense } from "react";

export default async function Dishes() {
  const t = await getTranslations("Dishes");
  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <Suspense>
        <DishesOverview></DishesOverview>
      </Suspense>
      <Button>
        <Link href="/dishes/create">{t("create")}</Link>
      </Button>
    </div>
  );
}
