"use client";
import { getCategories } from "@/app/queries";
import EntityFilterProvider, {
  EntityFilterProviderLocal,
  EntityFilterProviderType,
} from "./provider";
import { PropsWithChildren, useEffect, useState } from "react";

export default function EntityFilterProviderWrapper({
  entityName,
  onFiltersChange,
  children,
}: Omit<EntityFilterProviderType, "categoriesWithCounts"> & {
  onFiltersChange?: Parameters<
    typeof EntityFilterProviderLocal
  >[0]["onFiltersChange"];
} & PropsWithChildren) {
  const [categories, setCategories] =
    useState<Awaited<ReturnType<typeof getCategories>>>();
  useEffect(() => {
    (async () => {
      setCategories(await getCategories(entityName));
    })();
  }, []);
  if (!categories) return null;
  return onFiltersChange ? (
    <EntityFilterProviderLocal
      entityName={entityName}
      categoriesWithCounts={categories}
      onFiltersChange={onFiltersChange}
    >
      {children}
    </EntityFilterProviderLocal>
  ) : (
    <EntityFilterProvider
      entityName={entityName}
      categoriesWithCounts={categories}
    >
      {children}
    </EntityFilterProvider>
  );
}
