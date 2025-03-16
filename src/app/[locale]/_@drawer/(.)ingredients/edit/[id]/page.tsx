import { ingredientDeleteAction, ingredientEditAction } from "@/app/actions";
import IngredientEditor from "@/app/ui/ingredient/editor";
import React from "react";
import { API } from "@/sdk";
import BottomDrawer from "@/app/ui/collection/drawer";
import SaveButton from "@/app/ui/collection/save-button";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import { auth } from "@/app/auth";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  const session = await auth();
  return (
    <BottomDrawer
      header="Изменить ингредиент"
      buttonsSlot={
        session?.user.id === ingredient.createdBy && (
          <>
            <SaveButton form={id}></SaveButton>
            <DeleteButtonWithConfirmation
              deleteAction={ingredientDeleteAction.bind(null, id)}
              confirmationQuestion="Вы точно хотите удалить этот ингредиент?"
            ></DeleteButtonWithConfirmation>
          </>
        )
      }
    >
      <IngredientEditor
        redirect="/ingredients"
        noSaveButton
        noDeleteButton
        formId={id}
        entity={ingredient}
        submitAction={ingredientEditAction}
      ></IngredientEditor>
    </BottomDrawer>
  );
}
