import IngredientEditor from "@/app/ui/ingredient/editor";
import React from "react";
import { API } from "@/sdk";
import BottomDrawer from "@/app/ui/collection/drawer";
import SaveButton from "@/app/ui/collection/save-button";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import { userCanModifyEntity } from "@/app/auth";
import { ID } from "@/sdk/types";
import { deleteAction } from "@/app/actions/ingredient";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  const canEdit = await userCanModifyEntity(ingredient);
  return (
    <BottomDrawer
      header="Изменить ингредиент"
      buttonsSlot={
        canEdit && (
          <>
            <SaveButton form={id}></SaveButton>
            <DeleteButtonWithConfirmation
              deleteAction={deleteAction.bind(null, id)}
              confirmationQuestion="Вы точно хотите удалить этот ингредиент?"
            ></DeleteButtonWithConfirmation>
          </>
        )
      }
    >
      <IngredientEditor
        noSaveButton
        noDeleteButton
        formId={id}
        entityId={ingredient._id}
        entity={ingredient}
      ></IngredientEditor>
    </BottomDrawer>
  );
}
