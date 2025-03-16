"use client";
import useEntityFilters, {
  useEntityFiltersLocal,
} from "@/hooks/use-entity-filters";
import {
  PaginationReturn,
  usePaginationLocal,
  usePaginationQuery,
} from "@/hooks/use-pagination";
import { EntityEnum } from "@/sdk/types";
import { createContext, PropsWithChildren, useEffect } from "react";

export type EntityFilterContext = {
  entityName: EntityEnum;
  entityFilters: ReturnType<typeof useEntityFilters<string>>;
  pagination: PaginationReturn;
  categoriesWithCounts: [string, number][];
};

export const EntityFilterContext = createContext<EntityFilterContext>(null!);

export type EntityFilterProviderType = {
  entityName: EntityEnum;
  categoriesWithCounts: [string, number][];
} & PropsWithChildren;

export default function EntityFilterProvider({
  children,
  entityName,
  categoriesWithCounts,
}: EntityFilterProviderType) {
  const entityFilters = useEntityFilters(
    categoriesWithCounts.map((it) => it[0])
  );
  const pagination = usePaginationQuery();
  return (
    <EntityFilterContext.Provider
      value={{
        entityName,
        entityFilters,
        pagination,
        categoriesWithCounts,
      }}
    >
      {children}
    </EntityFilterContext.Provider>
  );
}

export function EntityFilterProviderLocal({
  children,
  entityName,
  categoriesWithCounts,
  onFiltersChange,
}: EntityFilterProviderType & {
  onFiltersChange: (
    filters: ReturnType<typeof useEntityFiltersLocal>["filters"]
  ) => {};
}) {
  const entityFilters = useEntityFiltersLocal();
  const pagination = usePaginationLocal();
  useEffect(() => {
    onFiltersChange(entityFilters.filters);
  }, [entityFilters.filters]);
  return (
    <EntityFilterContext.Provider
      value={{
        entityName,
        entityFilters,
        pagination,
        categoriesWithCounts,
      }}
    >
      {children}
    </EntityFilterContext.Provider>
  );
}
