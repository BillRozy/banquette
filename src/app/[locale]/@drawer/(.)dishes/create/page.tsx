import { dishSubmitAction } from "@/app/actions";
import BottomDrawer from "@/components/ui/collection/drawer";
import DishEditor from "@/components/ui/dish/editor";
import { API } from "@/sdk";
import React from "react";
import {} from "next/server";
import SaveButton from "@/components/ui/collection/save-button";
import { randomUUID } from "crypto";

export default async function DishCreator() {
  const ingredients = API.getIngredients();
  const id = randomUUID();

  return (
    <BottomDrawer
      header="Создать новое блюдо"
      buttonsSlot={<SaveButton form={id}></SaveButton>}
    >
      <DishEditor
        redirect="/dishes"
        formId={id}
        noDeleteButton
        noSaveButton
        ingredientsGetter={ingredients}
        submitAction={dishSubmitAction.bind(null)}
      ></DishEditor>
    </BottomDrawer>
  );
}
