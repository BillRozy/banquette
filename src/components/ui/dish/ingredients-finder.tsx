import React, { useMemo } from "react";
import { Button } from "../button";
import {
  Ingredient,
  MeasuredIngredient,
  Measurement,
  WithId,
} from "@/sdk/types";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function IngredientsFinder({
  ingredients,
  selectedIngredients,
  selector,
}: {
  ingredients: WithId<Ingredient>[];
  selectedIngredients: string[];
  selector: (ingredient: MeasuredIngredient | MeasuredIngredient[]) => void;
}) {
  const t = useTranslations("IngredientsFinder");
  const router = useRouter();
  const availableIngredients = useMemo(() => {
    return ingredients.filter((it) => !selectedIngredients.includes(it._id));
  }, [ingredients, selectedIngredients]);
  return (
    <ul className="flex flex-col">
      {availableIngredients.length === 0 && (
        <span>There are no ingredients available</span>
      )}
      {availableIngredients.map((it) => (
        <Button
          key={it._id}
          variant="ghost"
          onClick={() =>
            selector({
              ingredient: it._id,
              measure: Measurement.GRAMM,
              quantity: 0,
            })
          }
        >
          {it.name}
        </Button>
      ))}
      <Button
        variant={"outline"}
        onClick={() => router.push("/ingredients/create")}
      >
        {t("createIngredient")}
      </Button>
    </ul>
  );
}
