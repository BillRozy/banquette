import React from "react";
import NameFilter from "./name";
import CategoryFilter from "./category";
import EntityFilterProviderWrapper from "./ssr-wrapper";
import { EntityEnum } from "@/sdk/types";

export default function EntityFilters({
  entityName,
  onFiltersChange,
}: {
  entityName: EntityEnum;
  onFiltersChange?: Parameters<
    typeof EntityFilterProviderWrapper
  >[0]["onFiltersChange"];
}) {
  return (
    <div className="flex flex-col gap-4">
      <EntityFilterProviderWrapper
        entityName={entityName}
        onFiltersChange={onFiltersChange}
      >
        <NameFilter></NameFilter>
        <CategoryFilter></CategoryFilter>
      </EntityFilterProviderWrapper>
    </div>
  );
}
