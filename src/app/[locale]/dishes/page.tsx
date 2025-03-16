import DishesOverview from "@/app/ui/dish/overview";
import React from "react";
import EntitiesLayout from "@/app/ui/collection/layout/entities-overview-layout";
import { DishCategory } from "@/sdk/types";
import {
  EntitySearchParams,
  filtersFromLoader,
  getEntitySearchParamsLoader,
} from "@/app/utils";
import { API } from "@/sdk";
import EntityFilters from "@/app/ui/collection/filter/entity-filters";
import { PaginationWithQuery } from "@/app/ui/collection/pagination";
import { DishCategoryEnumSchema, EntityEnumSchema } from "@/sdk/schemas";

const loadSearchParams = getEntitySearchParamsLoader<DishCategory>(
  Object.values(DishCategoryEnumSchema.enum)
);

export default async function Dishes({
  searchParams,
}: {
  searchParams: Promise<EntitySearchParams>;
}) {
  const [dishes, dishesTotal] = await API.getDishes(
    await filtersFromLoader(loadSearchParams, searchParams)
  );
  return (
    <EntitiesLayout
      filters={<EntityFilters entityName={EntityEnumSchema.enum.Dish} />}
      entities={<DishesOverview dishes={dishes} />}
      pagination={<PaginationWithQuery totalElements={dishesTotal} />}
    />
  );
}
