import { env } from "process";
import {
  Ingredient,
  Dish,
  Menu,
  ID,
  WithId as WithSimpleId,
  IngredientCategory,
  EntityFindBy,
  DishCategory,
  Entity,
  EntityEnum,
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
  getEntity<T extends Entity>(
    entity: EntityEnum,
    id: string
  ): Promise<WithSimpleId<T>>;
  getEntityCategories<E extends Entity>(
    entity: EntityEnum
  ): Promise<[string, number][]>;
  getEntities<E extends Entity>(
    entity: EntityEnum,
    criteria?: EntityFindBy
  ): Promise<[WithSimpleId<E>[], number]>;
  createEntity<E extends Entity>(
    entityName: EntityEnum,
    entityData: WithoutId<E>
  ): Promise<ID>;
  updateEntity<E extends Entity>(
    entityName: EntityEnum,
    id: ID,
    entityData: Partial<E>
  ): Promise<void>;
  deleteEntity(entityName: EntityEnum, id: ID): Promise<void>;

  getIngredientsCategories(): Promise<[IngredientCategory, number][]>;
  getIngredient(id: string): Promise<WithSimpleId<Ingredient>>;
  getIngredients(
    criteria?: EntityFindBy
  ): Promise<[WithSimpleId<Ingredient>[], number]>;

  createIngredient(ingredient: WithoutId<Ingredient>): Promise<ID>;

  updateIngredient(id: ID, ingredient: Partial<Ingredient>): Promise<void>;

  deleteIngredient(id: ID): Promise<void>;
  getDishCategories(): Promise<[DishCategory, number][]>;

  getDish(id: ID): Promise<WithSimpleId<Dish>>;

  getDishes(criteria?: EntityFindBy): Promise<[WithSimpleId<Dish>[], number]>;

  createDish(dish: WithoutId<Dish>): Promise<ID>;

  updateDish(id: ID, dish: Partial<Dish>): Promise<void>;

  deleteDish(id: ID): Promise<void>;

  getMenu(id: ID): Promise<WithSimpleId<Menu>>;

  getMenus(): Promise<WithSimpleId<Menu>[]>;

  createMenu(menu: WithoutId<Menu>): Promise<ID>;

  updateMenu(id: ID, menu: Partial<Menu>): Promise<void>;

  deleteMenu(id: ID): Promise<WithSimpleId<Menu>>;

  cleanMenu(id: ID): Promise<void>;

  addDishToMenu(tableId: ID, dishId: ID): Promise<void>;

  incrementDishInMenu(tableId: ID, dishId: ID): Promise<void>;

  decrementDishInMenu(tableId: ID, dishId: ID): Promise<void>;

  removeDishFromMenu(tableId: ID, dishId: ID): Promise<void>;
};
