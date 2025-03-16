"use client";

import clsx from "clsx";
import { HoverCardTrigger } from "../../../components/ui/hover-card";
import { badgeVariants } from "../../../components/ui/badge";
import { Link } from "@/i18n/routing";
import { Ingredient, WithId } from "@/sdk/types";
import { useLocale } from "next-intl";

export default function TriggerWithLink({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  const locale = useLocale();
  return (
    <HoverCardTrigger
      className={clsx(badgeVariants({ variant: "outline" }), "cursor-pointer")}
      href={`/${locale}/ingredients/${ingredient._id}`}
    >
      {ingredient.name}
    </HoverCardTrigger>
  );
}
