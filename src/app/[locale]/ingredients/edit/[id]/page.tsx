import { ingredientSubmitAction } from "@/app/actions";
import IngredientEditor from "@/components/ui/ingredient/editor";
import React from "react";
import { API } from "@/sdk";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  return (
    <IngredientEditor
      redirect="/ingredients"
      entity={ingredient}
      submitAction={ingredientSubmitAction}
    ></IngredientEditor>
  );
}
