import { deleteAction } from "@/app/actions/dish";
import { userCanModifyEntity } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import EditButton from "@/app/ui/collection/edit-button";
import DishEditor from "@/app/ui/dish/editor";
import { API } from "@/sdk";
import { ID } from "@/sdk/types";
import React from "react";

export default async function DishPage({ params }: { params: Promise<{ id: ID }> }) {
  const { id } = await params;
  const dish = await API.getDish(id);
  const canEdit = await userCanModifyEntity(dish);
  const bindDelete = deleteAction.bind(null, id);
  return (
    <>
      <DishEditor entityId={id} entity={dish} readonly></DishEditor>
      {canEdit && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <EditButton href={`/dishes/edit/${dish._id}`}></EditButton>
          <DeleteButtonWithConfirmation
            deleteAction={bindDelete}
            confirmationQuestion={`Вы уверены что хотите удалить блюдо ${dish.name}`}
          ></DeleteButtonWithConfirmation>
        </div>
      )}
    </>
  );
}
