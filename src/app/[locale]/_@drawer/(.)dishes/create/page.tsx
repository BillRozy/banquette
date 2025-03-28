import BottomDrawer from "@/app/ui/collection/drawer";
import DishEditor from "@/app/ui/dish/editor";
import React from "react";
import SaveButton from "@/app/ui/collection/save-button";
import { randomUUID } from "crypto";

export default async function DishCreator() {
  const id = randomUUID();

  return (
    <BottomDrawer
      header="Создать новое блюдо"
      buttonsSlot={<SaveButton form={id}></SaveButton>}
    >
      <DishEditor
        redirect="/dishes"
        formId={id}
        noDeleteButton
        noSaveButton
      ></DishEditor>
    </BottomDrawer>
  );
}
