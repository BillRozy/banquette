import DishEditor from "@/components/ui/dish/editor";
import React from "react";
import { dishSubmitAction } from "@/app/actions";
import { API } from "@/sdk";

export default async function DishCreator() {
  const ingredients = API.getIngredients();
  return (
    <DishEditor
      redirect="/dishes"
      submitAction={dishSubmitAction}
      ingredientsGetter={ingredients}
    ></DishEditor>
  );
}
