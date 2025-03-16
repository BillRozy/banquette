import { ingredientCreateAction } from "@/app/actions";
import BottomDrawer from "@/app/ui/collection/drawer";
import SaveButton from "@/app/ui/collection/save-button";
import IngredientEditor from "@/app/ui/ingredient/editor";
import { randomUUID } from "crypto";
import React from "react";

export default function IngredientCreator() {
  const id = randomUUID();
  return (
    <BottomDrawer
      header="Создать новый ингредиент"
      buttonsSlot={<SaveButton form={id}></SaveButton>}
    >
      <IngredientEditor
        redirect="/ingredients"
        noSaveButton
        noDeleteButton
        formId={id}
        submitAction={ingredientCreateAction}
      ></IngredientEditor>
    </BottomDrawer>
  );
}
