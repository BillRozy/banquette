import { EntityFilter, EntityFindBy } from "@/sdk/types";
import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsStringEnum,
  createLoader,
} from "nuqs/server";

export type EntitySearchParams = {
  name?: string;
  page?: string;
  perPage?: string;
  categories?: string;
};

export function entitySearchParams<T extends string>(categoryEnum: T[]) {
  return {
    name: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(25),
    categories: parseAsArrayOf(parseAsStringEnum<T>(categoryEnum)).withDefault(
      []
    ),
  };
}

export function getEntitySearchParamsLoader<T extends string>(
  categoryEnum: T[]
) {
  return createLoader(entitySearchParams(categoryEnum));
}

type BoxFunc<T extends string> = typeof getEntitySearchParamsLoader<T>;

export async function filtersFromLoader<T extends string>(
  loader: ReturnType<BoxFunc<T>>,
  params: Promise<EntitySearchParams>
): Promise<EntityFindBy<T>> {
  const { name, page, perPage, categories } = await loader(params);
  const filter: EntityFilter<T> = {};
  if (name !== "") {
    filter.nameLike = name;
  }
  if (categories.length > 0) {
    filter.categories = categories;
  }
  return {
    filter,
    pagination: {
      perPage,
      page,
    },
  };
}
