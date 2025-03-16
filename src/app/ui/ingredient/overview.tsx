import { Ingredient, WithId } from "@/sdk/types";
import React, { ReactNode } from "react";
import IngredientCard from "./card";

export default function IngredientsOverview({
  ingredients,
  newIngredientSlot,
}: {
  ingredients: WithId<Ingredient>[];
  newIngredientSlot?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {ingredients.map((ingredient) => (
        <IngredientCard
          key={ingredient._id}
          ingredient={ingredient}
        ></IngredientCard>
      ))}
      {newIngredientSlot}
    </div>
  );
}
