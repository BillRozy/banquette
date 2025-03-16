import { Filter } from "mongodb";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useState } from "react";

type Filters<T extends string> = {
  name?: string | null;
  categories?: T[] | null;
};

export const useEntityFiltersLocal = <T extends string>({
  name = "",
  categories = null,
}: Filters<T> = {}) => {
  const [filters, setFilters] = useState<Filters<T>>({
    name,
    categories,
  });
  const setName = (name: string | null = "") => {
    setFilters((curVal) => ({
      name: name,
      categories: curVal.categories,
    }));
  };
  const setCategories = (categories: T[] | null = null) => {
    setFilters((curVal) => ({
      name: curVal.name,
      categories: categories,
    }));
  };
  return {
    setName,
    setCategories,
    name: filters.name,
    categories: filters.categories,
    setFilters,
    filters,
  };
};

export default function <T extends string>(availableCategoriesForEntity: T[]) {
  const [filters, setFilters] = useQueryStates(
    {
      categories: parseAsArrayOf(
        parseAsStringEnum<T>(availableCategoriesForEntity)
      ),
      name: parseAsString.withDefault(""),
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
  const setCategories = (categories: T[] | null = null) => {
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
