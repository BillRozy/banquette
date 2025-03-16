import { dishDeleteAction } from "@/app/actions";
import { auth } from "@/app/auth";
import DeleteButtonWithConfirmation from "@/app/ui/collection/delete-button-with-confirmation";
import BottomDrawer from "@/app/ui/collection/drawer";
import EditButton from "@/app/ui/collection/edit-button";
import DishEditor from "@/app/ui/dish/editor";
import { API } from "@/sdk";
import React from "react";

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const dish = await API.getDish(id);
  const ingredients = API.getIngredients();

  return (
    <BottomDrawer
      header={dish.name}
      buttonsSlot={
        session?.user.id === dish.createdBy && (
          <>
            <EditButton href={`/dishes/edit/${dish._id}`}></EditButton>
            <DeleteButtonWithConfirmation
              deleteAction={dishDeleteAction.bind(null, id)}
              confirmationQuestion={`Вы уверены что хотите удалить блюдо ${dish.name}`}
            ></DeleteButtonWithConfirmation>
          </>
        )
      }
    >
      <DishEditor
        entity={dish}
        ingredientsGetter={ingredients}
        readonly
      ></DishEditor>
    </BottomDrawer>
  );
}
