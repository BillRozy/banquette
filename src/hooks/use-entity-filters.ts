import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useState } from "react";

type Filters = {
  name?: string | null;
  categories?: string[] | null;
};

type UseFiltersReturn = {
  setName: (name: string | null) => void;
  setCategories: (categories: string[] | null) => void;
  name: string | null;
  categories: string[] | null;
  setFilters: (filters: Filters) => void;
  filters: Filters;
}

export const useEntityFiltersLocal = ({
  name = null,
  categories = null,
}: Filters = {}) : UseFiltersReturn => {
  const [filters, setFilters] = useState<Filters>({
    name,
    categories,
  });
  const setName = (name: string | null = null) => {
    setFilters((curVal) => ({
      name: name,
      categories: curVal.categories,
    }));
  };
  const setCategories = (categories: string[] | null = null) => {
    setFilters((curVal) => ({
      name: curVal.name,
      categories: categories,
    }));
  };
  return {
    setName,
    setCategories,
    name: filters.name ?? null,
    categories: filters.categories ?? null,
    setFilters,
    filters,
  };
};

export default function useEntityFilters(availableCategoriesForEntity: string[]) : UseFiltersReturn {
  const [filters, setFilters] = useQueryStates(
    {
      categories: parseAsArrayOf(
        parseAsStringEnum(availableCategoriesForEntity)
      ),
      name: parseAsString,
    },
    {
      shallow: false,
    }
  );

  const setName = (name: string | null = null) => {
    setFilters({
      name,
      categories: filters.categories,
    });
  };
  const setCategories = (categories: string[] | null = null) => {
    setFilters({
      name: filters.name,
      categories,
    });
  };
  return {
    setName,
    setCategories,
    name: filters.name,
    categories: filters.categories,
    setFilters,
    filters,
  };
}
