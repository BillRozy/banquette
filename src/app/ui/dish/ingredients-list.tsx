import { Ingredient, MeasuredIngredient, WithId } from "@/sdk/types";
import React, { Suspense } from "react";
import { badgeVariants } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { HoverCard, HoverCardContent } from "../../../components/ui/hover-card";
import TriggerWithLink from "./ingredient-badge";
import IngredientPreview from "../ingredient/ingredient-preview";
import { useTranslations } from "next-intl";
import { findIngredients } from "@/app/queries";

function IngredientsListFallback() {
  return (
    <ul>
      <Skeleton className={badgeVariants({ variant: "outline" })}></Skeleton>
    </ul>
  );
}

function IngridientHoverCard({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  return (
    <HoverCard>
      <TriggerWithLink ingredient={ingredient}></TriggerWithLink>
      <HoverCardContent className="w-fit max-w-md">
        <IngredientPreview ingredient={ingredient}></IngredientPreview>
      </HoverCardContent>
    </HoverCard>
  );
}

const MAX_TO_SHOW = 3;

export default async function IngredientsList({
  ingredients,
}: {
  ingredients: MeasuredIngredient[];
}) {
  const t = useTranslations("Components.IngredientsList");
  const [loadedIngredients, totalIngredientsCount] = await findIngredients({
    filter: {
      ids: ingredients.map((it) => it.ingredient),
    },
  });
  const showAdditionalIngredientsBadge = totalIngredientsCount > MAX_TO_SHOW;
  const additionalIngredients = totalIngredientsCount - MAX_TO_SHOW;

  return (
    <Suspense fallback={<IngredientsListFallback></IngredientsListFallback>}>
      <ul className="flex flex-wrap gap-2">
        {loadedIngredients.slice(0, MAX_TO_SHOW).map((it) => {
          return (
            <IngridientHoverCard
              key={it._id}
              ingredient={it}
            ></IngridientHoverCard>
          );
        })}
        {showAdditionalIngredientsBadge && (
          <span className="text-xs px-2.5">
            {t("andMore", { quantity: additionalIngredients })}
          </span>
        )}
      </ul>
    </Suspense>
  );
}
