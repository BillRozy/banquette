import React from "react";
import { API } from "@/sdk";
import DishEditor from "@/app/ui/dish/editor";
import { userCanModifyEntity } from "@/app/auth";
import { ID } from "@/sdk/types";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const dish = await API.getDish(id);
  const canEdit = await userCanModifyEntity(dish);
  return (
    <DishEditor
      entity={dish}
      entityId={dish._id}
      readonly={!canEdit}
    ></DishEditor>
  );
}
