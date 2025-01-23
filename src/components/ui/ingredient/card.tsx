import React from "react";
import { Card, CardHeader, CardTitle } from "../card";
import { Ingredient, WithId } from "@/sdk/types";
import { Link } from "@/i18n/routing";

export default function IngredientCard({
  ingredient,
}: {
  ingredient: WithId<Ingredient>;
}) {
  return (
    <Link href={`/ingredients/${ingredient._id}`}>
      <Card className="flex flex-col gap-2 p-0 items-center border-none shadow-none bg-transparent">
        <div className="size-24 relative rounded-full overflow-hidden hover:border-2 shadow-md shadow-gray-700/20">
          <img
            src={ingredient.picture}
            alt="picture of the ingredient"
            className="object-fit w-full h-full z-0 absolute"
          ></img>
          <div className="bg-gray-900/50 z-10 w-full h-full absolute"></div>
        </div>
        <CardHeader className="p-0">
          <div className="flex gap-2 items-center">
            <CardTitle className="font-medium text-sm">
              {ingredient.name}
            </CardTitle>
            <div className="w-full"></div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
