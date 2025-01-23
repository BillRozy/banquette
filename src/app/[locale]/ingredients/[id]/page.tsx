import { ingredientDeleteAction } from "@/app/actions";
import { auth } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/components/ui/collection/delete-button-with-confirmation";
import EditButton from "@/components/ui/collection/edit-button";
import IngredientEditor from "@/components/ui/ingredient/editor";
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
    <>
      <IngredientEditor entity={ingredient} readonly={true}></IngredientEditor>
      {session?.user.id === ingredient.createdBy && (
        <div className="flex gap-4 justify-center items-center mt-8">
          <EditButton href={`/ingredients/edit/${ingredient._id}`}></EditButton>
          <DeleteButtonWithConfirmation
            deleteAction={ingredientDeleteAction.bind(null, id)}
            confirmationQuestion="Вы точно хотите удалить этот ингредиент?"
          ></DeleteButtonWithConfirmation>
        </div>
      )}
    </>
  );
}
