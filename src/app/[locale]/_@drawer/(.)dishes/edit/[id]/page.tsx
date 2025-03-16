import { dishDeleteAction, dishEditAction } from "@/app/actions";
import React from "react";
import { API } from "@/sdk";
import DishEditor from "@/app/ui/dish/editor";
import BottomDrawer from "@/app/ui/collection/drawer";
import SaveButton from "@/app/ui/collection/save-button";
import { auth } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";

export default async function EditDish({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const dish = await API.getDish(id);
  const ingredients = API.getIngredients();
  return (
    <BottomDrawer
      header="Изменить блюдо"
      buttonsSlot={
        session?.user.id === dish.createdBy && (
          <>
            <SaveButton form={id}></SaveButton>
            <DeleteButtonWithConfirmation
              deleteAction={dishDeleteAction.bind(null, id)}
              confirmationQuestion="Вы точно хотите удалить этот ингредиент?"
            ></DeleteButtonWithConfirmation>
          </>
        )
      }
    >
      <DishEditor
        redirect="/dishes"
        formId={id}
        noDeleteButton
        noSaveButton
        entity={dish}
        ingredientsGetter={ingredients}
        submitAction={dishEditAction}
        readonly={dish.createdBy !== session?.user.id}
      ></DishEditor>
    </BottomDrawer>
  );
}
