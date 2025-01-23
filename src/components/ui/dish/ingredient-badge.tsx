"use client";

import clsx from "clsx";
import { HoverCardTrigger } from "../hover-card";
import { badgeVariants } from "../badge";
import { useRouter } from "@/i18n/routing";
import { Ingredient, WithId } from "@/sdk/types";

export default function TriggerWithLink({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  const router = useRouter();

  return (
    <HoverCardTrigger
      className={clsx(badgeVariants({ variant: "outline" }), "cursor-pointer")}
      onClick={() => router.push(`/ingredients/${ingredient._id}`)}
    >
      {ingredient.name}
    </HoverCardTrigger>
  );
}
