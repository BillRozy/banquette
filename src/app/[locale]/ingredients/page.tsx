import { PaginationWithQuery } from "@/app/ui/collection/pagination";
import IngredientsOverview from "@/app/ui/ingredient/overview";
import { API } from "@/sdk";
import React from "react";

import { IngredientCategory } from "@/sdk/types";
import EntitiesLayout from "@/app/ui/collection/layout/entities-overview-layout";
import {
  EntitySearchParams,
  filtersFromLoader,
  getEntitySearchParamsLoader,
} from "@/app/utils";
import EntityFilters from "@/app/ui/collection/filter/entity-filters";
import { EntityEnumSchema, IngredientCategoryEnumSchema } from "@/sdk/schemas";

const loadSearchParams = getEntitySearchParamsLoader<IngredientCategory>(
  Object.values(IngredientCategoryEnumSchema.enum)
);

export default async function Ingredients({
  searchParams,
}: {
  searchParams: Promise<EntitySearchParams>;
}) {
  const [ingredients, ingredientsTotal] = await API.getIngredients(
    await filtersFromLoader(loadSearchParams, searchParams)
  );

  return (
    <EntitiesLayout
      filters={<EntityFilters entityName={EntityEnumSchema.enum.Ingredient} />}
      entities={<IngredientsOverview ingredients={ingredients} />}
      pagination={<PaginationWithQuery totalElements={ingredientsTotal} />}
    />
  );
}
