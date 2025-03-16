import { deleteAction } from "@/app/actions/ingredient";
import { userCanModifyEntity } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
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
  const ingredient = await API.getIngredient(id);
  const canEdit = await userCanModifyEntity(ingredient);
  const bindDelete = deleteAction.bind(null, id);
  return (
    <>
      <IngredientEditor
        entityId={ingredient._id}
        entity={ingredient}
        readonly={true}
      ></IngredientEditor>
      {canEdit && (
        <div className="flex gap-4 justify-center items-center mt-8">
          <EditButton href={`/ingredients/edit/${ingredient._id}`}></EditButton>
          <DeleteButtonWithConfirmation
            redirect="/ingredients"
            deleteAction={bindDelete}
            confirmationQuestion="Вы точно хотите удалить этот ингредиент?"
          ></DeleteButtonWithConfirmation>
        </div>
      )}
    </>
  );
}
