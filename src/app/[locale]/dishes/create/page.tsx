import DishEditor from "@/app/ui/dish/editor";
import React from "react";

export default async function DishCreator() {
  return <DishEditor redirect="/dishes"></DishEditor>;
}
