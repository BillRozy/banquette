import { Ingredient, MeasuredIngredient, WithId } from "@/sdk/types";
import React, { Suspense } from "react";
import { badgeVariants } from "../badge";
import { requestIngredientsByIDs } from "@/app/actions";
import { Skeleton } from "../skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import IngredientEditor from "../ingredient/editor";
import TriggerWithLink from "./ingredient-badge";

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
        <IngredientEditor
          entity={ingredient}
          readonly={true}
        ></IngredientEditor>
      </HoverCardContent>
    </HoverCard>
  );
}

export default async function IngredientsList({
  ingredients,
}: {
  ingredients: MeasuredIngredient[];
}) {
  const loadedIngredients = await requestIngredientsByIDs(
    ingredients.map((it) => it.ingredient)
  );
  return (
    <Suspense fallback={<IngredientsListFallback></IngredientsListFallback>}>
      <ul className="flex flex-wrap gap-2">
        {loadedIngredients.map((it) => {
          return (
            <IngridientHoverCard
              key={it._id}
              ingredient={it}
            ></IngridientHoverCard>
          );
        })}
      </ul>
    </Suspense>
  );
}
