import { dishDeleteAction } from "@/app/actions";
import DeleteButtonWithConfirmation from "@/components/ui/collection/delete-button-with-confirmation";
import EditButton from "@/components/ui/collection/edit-button";
import DishEditor from "@/components/ui/dish/editor";
import { API } from "@/sdk";
import React from "react";

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dish = await API.getDish(id);
  const ingredients = API.getIngredients();
  return (
    <>
      <DishEditor
        entity={dish}
        ingredientsGetter={ingredients}
        readonly
      ></DishEditor>
      <div className="flex justify-center items-center gap-4 mt-8">
        <EditButton href={`/dishes/edit/${dish._id}`}></EditButton>
        <DeleteButtonWithConfirmation
          deleteAction={dishDeleteAction.bind(null, id)}
          confirmationQuestion={`Вы уверены что хотите удалить блюдо ${dish.name}`}
        ></DeleteButtonWithConfirmation>
      </div>
    </>
  );
}
