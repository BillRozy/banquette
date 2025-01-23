"use server";

import { API } from "@/sdk";
import {
  Dish,
  DishID,
  Ingredient,
  IngredientID,
  WithId,
  WithoutId,
} from "@/sdk/types";

import { redirect } from "@/i18n/routing";

import { getLocale } from "next-intl/server";
import { getJson } from "serpapi";
import { auth } from "./auth";
import { AuthError } from "next-auth";

export const ingredientDeleteAction = async (ingredientId: IngredientID) => {
  const [session, ingredient] = await Promise.all([
    auth(),
    API.getIngredient(ingredientId),
  ]);
  if (session && session.user.id === ingredient.createdBy) {
    await API.deleteIngredient(ingredientId);
    const locale = await getLocale();
    redirect({
      href: "/ingredients",
      locale,
    });
  } else {
    throw new AuthError("You are not allowed to delete this ingredient");
  }
};

export const dishDeleteAction = async (dishId: DishID) => {
  await API.deleteDish(dishId);
  const locale = await getLocale();
  redirect({
    href: "/dishes",
    locale,
  });
};

export const ingredientSubmitAction = async (
  ingredient: Partial<WithId<Ingredient>>
) => {
  let id = ingredient._id!;
  if ("_id" in ingredient) {
    await API.updateIngredient(id, ingredient as WithId<Partial<Ingredient>>);
  } else {
    id = await API.createIngredient(ingredient as WithoutId<Ingredient>);
  }
};

export const dishSubmitAction = async (dish: Partial<WithId<Dish>>) => {
  let id = dish._id!;
  if ("_id" in dish) {
    await API.updateDish(id, dish as WithId<Partial<Dish>>);
  } else {
    id = await API.createDish(dish as WithoutId<Dish>);
  }
};

export const requestIngredientsByIDs = async (
  ids: string[]
): Promise<WithId<Ingredient>[]> => {
  const ingredients = await API.getIngredients(...ids);
  return ingredients.filter((it) => ids.includes(it._id));
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
  return result.images_results.map((it) => it.original).slice(0, 10);
};
