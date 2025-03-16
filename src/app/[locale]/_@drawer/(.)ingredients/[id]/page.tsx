import { ingredientDeleteAction } from "@/app/actions";
import { auth } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import BottomDrawer from "@/app/ui/collection/drawer";
import EditButton from "@/app/ui/collection/edit-button";
import IngredientEditor from "@/app/ui/ingredient/editor";
import { API } from "@/sdk";
import React from "react";

export default async function IngredientView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, ingredient] = await Promise.all([
    auth(),
    API.getIngredient(id),
  ]);
  return (
    <BottomDrawer
      header={ingredient.name}
      buttonsSlot={
        session?.user.id === ingredient.createdBy && (
          <>
            <EditButton
              href={`/ingredients/edit/${ingredient._id}`}
            ></EditButton>
            <DeleteButtonWithConfirmation
              deleteAction={ingredientDeleteAction.bind(null, id)}
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
