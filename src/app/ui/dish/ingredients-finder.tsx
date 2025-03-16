"use-client";
import React, { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { IngredientCategory, MeasuredIngredient } from "@/sdk/types";
import { findIngredients } from "@/app/queries";
import EntitiesLayout from "../collection/layout/entities-overview-layout";
import EntityFilters from "../collection/filter/entity-filters";
import { PaginationLocal } from "../collection/pagination";
import { EntityEnumSchema, MassMeasurementEnumSchema } from "@/sdk/schemas";

type FilterChange = NonNullable<
  Parameters<typeof EntityFilters>[0]["onFiltersChange"]
>;
export default function IngredientsFinder({
  selectedIngredients,
  selector,
}: {
  selectedIngredients: string[];
  selector: (ingredient: MeasuredIngredient | MeasuredIngredient[]) => void;
}) {
  const [[ingredients, ingredientsCount], setIngredients] = useState<
    Awaited<ReturnType<typeof findIngredients>>
  >([[], 0]);
  const perPage = 10;
  const filtersCache = useRef<Parameters<FilterChange>[0]>({
    categories: [],
    name: "",
  });

  const onFiltersChange: FilterChange = async (filters) => {
    filtersCache.current = filters;
    setIngredients(
      await findIngredients({
        filter: {
          categories: filters.categories as IngredientCategory[],
          nameLike: filters.name ?? "",
        },
        pagination: {
          page: 1,
          perPage,
        },
      })
    );
  };
  const onPageChange = async (page: number) => {
    setIngredients(
      await findIngredients({
        filter: {
          categories: filtersCache.current.categories as IngredientCategory[],
          nameLike: filtersCache.current.name ?? "",
        },
        pagination: {
          page: page,
          perPage,
        },
      })
    );
  };
  return (
    <EntitiesLayout
      filters={
        <EntityFilters
          entityName={EntityEnumSchema.enum.Ingredient}
          onFiltersChange={onFiltersChange}
        />
      }
      entities={
        <ul className="flex flex-wrap">
          {ingredients.length === 0 && (
            <span>
              There are no ingredients available. Try to change search
              parameters
            </span>
          )}
          {ingredients.map((it) => (
            <Button
              disabled={selectedIngredients.includes(it._id)}
              key={it._id}
              variant="ghost"
              onClick={() =>
                selector({
                  ingredient: it._id,
                  measure: MassMeasurementEnumSchema.enum.kg,
                  quantity: 0,
                })
              }
            >
              {it.name}
            </Button>
          ))}
        </ul>
      }
      pagination={
        <PaginationLocal
          minimal
          totalElements={ingredientsCount}
          paginationOptions={{ defaultPerPage: perPage }}
          onPageChange={onPageChange}
        />
      }
    />
  );
}
