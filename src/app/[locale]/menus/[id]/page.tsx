import { deleteAction } from "@/app/actions/menu";
import { userCanModifyEntity } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import EditButton from "@/app/ui/collection/edit-button";
import MenuEditor from "@/app/ui/menu/editor";
import { API } from "@/sdk";
import { ID } from "@/sdk/types";
import React from "react";

export default async function MenuView({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const [menu, [dishes]] = await Promise.all([
    API.getMenu(id),
    API.getDishes(),
  ]);
  const canEdit = await userCanModifyEntity(menu);
  const bindDelete = deleteAction.bind(null, id);
  return (
    <>
      <MenuEditor dishes={dishes} entity={menu} readonly={true}></MenuEditor>
      {canEdit && (
        <div className="flex gap-4 justify-center items-center mt-8">
          <EditButton href={`/menus/edit/${menu._id}`}></EditButton>
          <DeleteButtonWithConfirmation
            deleteAction={bindDelete}
            confirmationQuestion="Вы точно хотите удалить это меню?"
          ></DeleteButtonWithConfirmation>
        </div>
      )}
    </>
  );
}
