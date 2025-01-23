import { ingredientSubmitAction } from "@/app/actions";
import BottomDrawer from "@/components/ui/collection/drawer";
import SaveButton from "@/components/ui/collection/save-button";
import IngredientEditor from "@/components/ui/ingredient/editor";
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
        submitAction={ingredientSubmitAction}
      ></IngredientEditor>
    </BottomDrawer>
  );
}
