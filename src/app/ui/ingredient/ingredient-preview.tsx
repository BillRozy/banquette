import { Ingredient, WithId } from "@/sdk/types";
import React from "react";
import IngredientThumb from "./ingredient-thumb";
import { UserIcon } from "lucide-react";

export default function IngredientPreview({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  return (
    <div className="flex justify-between gap-4">
      <IngredientThumb
        id={ingredient._id}
        className="size-12 border-[1px] border-gray-200 rounded-sm"
      ></IngredientThumb>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{ingredient.name}</h4>
        <p className="text-sm">{ingredient.description}</p>
        <div className="flex items-center pt-2">
          <UserIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
          <span className="text-xs text-muted-foreground">
            {ingredient.createdBy ?? "default"}
          </span>
        </div>
      </div>
    </div>
  );
}
