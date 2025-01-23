import { ingredientSubmitAction } from "@/app/actions";
import IngredientEditor from "@/components/ui/ingredient/editor";
import React from "react";

export default async function IngredientCreator() {
  return (
    <IngredientEditor
      redirect="/ingredients"
      submitAction={ingredientSubmitAction}
    ></IngredientEditor>
  );
}
