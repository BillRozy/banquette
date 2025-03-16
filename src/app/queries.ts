"use server";

import { API } from "@/sdk";
import { EntityEnum, ID } from "@/sdk/types";
import { getJson } from "serpapi";
import searcher from "./services/search-images";

export const getIngredientById = async (id: ID) => {
  return API.getIngredient(id);
};

export const findIngredients = async (
  criteria: Parameters<typeof API.getIngredients>[0] = {}
) => {
  return API.getIngredients(criteria);
};

export const getCategories = async (entityName: EntityEnum) => {
  return API.getEntityCategories(entityName);
};

export const searchPicturesByDescription2 = async (
  description: string,
  locale: string
): Promise<string[]> => {
  return (await searcher.search(description, locale))
    .filter((it) => it.image != null)
    .map((it) => it.image) as string[];
};

export const searchPicturesByDescription = async (
  description: string,
  locale: string,
  location?: string
): Promise<string[]> => {
  const result = await getJson({
    api_key: "a4ca83075284b3b9fd3ec3ddbde77dc9c66577d472ef9815805e305016b086fd",
    engine: "google_images",
    q: description,
    location,
    google_domain: "google.com",
    hl: locale,
    imgar: "s",
  });
  // TODO: create type for serpapi search result
  return result.images_results.map((it: any) => it.original).slice(0, 10);
};
