import { env } from "process";
import {
  Ingredient,
  Dish,
  Menu,
  ID,
  IngredientID,
  DishID,
  MenuID,
  WithId as WithSimpleId,
} from "./types";
import { WithoutId } from "mongodb";
export class APIError extends Error {}
export enum StorageCollections {
  INGREDIENTS = "ingredients",
  DISHES = "dishes",
  MENUS = "menus",
}
export const DB_NAME = env.DB_NAME!;
export type API = {
  getIngredient(id: string): Promise<WithSimpleId<Ingredient>>;
  getIngredients(...ids: string[]): Promise<WithSimpleId<Ingredient>[]>;

  createIngredient(ingredient: WithoutId<Ingredient>): Promise<ID>;

  updateIngredient(
    id: IngredientID,
    ingredient: WithSimpleId<Partial<Ingredient>>
  ): Promise<void>;

  deleteIngredient(id: IngredientID): Promise<void>;
  getDish(id: DishID): Promise<WithSimpleId<Dish>>;

  getDishes(): Promise<WithSimpleId<Dish>[]>;

  createDish(dish: WithoutId<Dish>): Promise<DishID>;

  updateDish(id: DishID, dish: WithSimpleId<Partial<Dish>>): Promise<void>;

  deleteDish(id: DishID): Promise<void>;

  getMenus(): Promise<WithSimpleId<Menu>[]>;

  createMenu(menu: WithoutId<Menu>): Promise<MenuID>;

  deleteMenu(id: MenuID): Promise<WithSimpleId<Menu>>;

  cleanMenu(id: MenuID): Promise<void>;

  addDishToMenu(tableId: MenuID, dishId: DishID): Promise<void>;

  incrementDishInMenu(tableId: MenuID, dishId: MenuID): Promise<void>;

  decrementDishInMenu(tableId: MenuID, dishId: MenuID): Promise<void>;

  removeDishFromMenu(tableId: MenuID, dishId: MenuID): Promise<void>;
};
