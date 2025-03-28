import { deleteAction } from "@/app/actions/ingredient";
import { userCanModifyEntity } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import BottomDrawer from "@/app/ui/collection/drawer";
import EditButton from "@/app/ui/collection/edit-button";
import IngredientEditor from "@/app/ui/ingredient/editor";
import { API } from "@/sdk";
import { ID } from "@/sdk/types";
import React from "react";

export default async function IngredientView({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  const canEdit = await userCanModifyEntity(ingredient);
  const bindDelete = deleteAction.bind(null, id);
  return (
    <BottomDrawer
      header={ingredient.name}
      buttonsSlot={
        canEdit && (
          <>
            <EditButton
              href={`/ingredients/edit/${ingredient._id}`}
            ></EditButton>
            <DeleteButtonWithConfirmation
              deleteAction={bindDelete}
              confirmationQuestion={`Вы уверены что хотите удалить ингредиент ${ingredient.name}`}
            ></DeleteButtonWithConfirmation>
          </>
        )
      }
    >
      <IngredientEditor entity={ingredient} readonly={true}></IngredientEditor>
    </BottomDrawer>
  );
}
