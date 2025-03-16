import React from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Ingredient, WithId } from "@/sdk/types";
import { Link } from "@/i18n/routing";
import IngredientThumb from "./ingredient-thumb";

export default function IngredientCard({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  return (
    <Link href={`/ingredients/${ingredient._id}`}>
      <Card className="flex flex-col gap-2 p-0 items-center border-none shadow-none bg-transparent w-32">
        <div className="size-24 relative rounded-full overflow-hidden hover:border-2 border-gray-500 shadow-md shadow-gray-700/20">
          <IngredientThumb
            id={ingredient._id}
            className="object-fit w-full h-full z-0 absolute"
          ></IngredientThumb>
          <div className="bg-gray-900/20 z-10 w-full h-full absolute"></div>
        </div>
        <CardHeader className="p-0 flex gap-2 items-center">
          <CardTitle className="font-medium text-sm text-center">
            {ingredient.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
