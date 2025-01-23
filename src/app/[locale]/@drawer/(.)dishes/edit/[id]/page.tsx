import { dishSubmitAction } from "@/app/actions";
import React from "react";
import { API } from "@/sdk";
import DishEditor from "@/components/ui/dish/editor";
import BottomDrawer from "@/components/ui/collection/drawer";
import SaveButton from "@/components/ui/collection/save-button";
import DeleteButton from "@/components/ui/collection/delete-button";

export default async function EditIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dish = await API.getDish(id);
  const ingredients = API.getIngredients();
  return (
    <BottomDrawer
      header="Изменить блюдо"
      buttonsSlot={
        <>
          <SaveButton form={id}></SaveButton>
          <DeleteButton href={`/dishes/delete/${id}`}></DeleteButton>
        </>
      }
    >
      <DishEditor
        redirect="/dishes"
        formId={id}
        noDeleteButton
        noSaveButton
        entity={dish}
        ingredientsGetter={ingredients}
        submitAction={dishSubmitAction}
      ></DishEditor>
    </BottomDrawer>
  );
}
