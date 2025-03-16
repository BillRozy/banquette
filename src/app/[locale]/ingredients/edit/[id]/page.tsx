import IngredientEditor from "@/app/ui/ingredient/editor";
import React from "react";
import { API } from "@/sdk";
import { userCanModifyEntity } from "@/app/auth";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await API.getIngredient(id);
  const canEdit = await userCanModifyEntity(ingredient);
  return (
    <IngredientEditor
      entity={ingredient}
      entityId={ingredient._id}
      readonly={!canEdit}
    ></IngredientEditor>
  );
}
