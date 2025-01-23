import { dishSubmitAction } from "@/app/actions";
import React from "react";
import { API } from "@/sdk";
import DishEditor from "@/components/ui/dish/editor";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dish = await API.getDish(id);
  const ingredients = API.getIngredients();
  return (
    <DishEditor
      redirect="/dishes"
      entity={dish}
      ingredientsGetter={ingredients}
      submitAction={dishSubmitAction}
    ></DishEditor>
  );
}
