import { ingredientSubmitAction } from "@/app/actions";
import IngredientEditor from "@/components/ui/ingredient/editor";
import React from "react";
import { API } from "@/sdk";
import BottomDrawer from "@/components/ui/collection/drawer";
import SaveButton from "@/components/ui/collection/save-button";
import DeleteButton from "@/components/ui/collection/delete-button";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  return (
    <BottomDrawer
      header="Изменить ингредиент"
      buttonsSlot={
        <>
          <SaveButton form={id}></SaveButton>
          <DeleteButton href={`/ingredients/delete/${id}`}></DeleteButton>
        </>
      }
    >
      <IngredientEditor
        redirect="/ingredients"
        noSaveButton
        noDeleteButton
        formId={id}
        entity={ingredient}
        submitAction={ingredientSubmitAction}
      ></IngredientEditor>
    </BottomDrawer>
  );
}
