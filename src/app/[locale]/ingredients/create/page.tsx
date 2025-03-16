import IngredientEditor from "@/app/ui/ingredient/editor";
import React from "react";

export default async function IngredientCreator() {
  return <IngredientEditor redirect="/ingredients"></IngredientEditor>;
}
