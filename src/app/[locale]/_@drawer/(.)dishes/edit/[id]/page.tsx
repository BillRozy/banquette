import { deleteAction } from "@/app/actions/dish";
import React from "react";
import { API } from "@/sdk";
import DishEditor from "@/app/ui/dish/editor";
import BottomDrawer from "@/app/ui/collection/drawer";
import SaveButton from "@/app/ui/collection/save-button";
import { auth, userCanModifyEntity } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import { ID } from "@/sdk/types";

export default async function EditDish({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const session = await auth();

  const dish = await API.getDish(id);
  const canEdit = await userCanModifyEntity(dish);

  return (
    <BottomDrawer
      header="Изменить блюдо"
      buttonsSlot={
        session?.user.id === dish.createdBy && (
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
      <DishEditor
        formId={id}
        noDeleteButton
        noSaveButton
        entity={dish}
        entityId={dish._id}
        readonly={!canEdit}
      ></DishEditor>
    </BottomDrawer>
  );
}
