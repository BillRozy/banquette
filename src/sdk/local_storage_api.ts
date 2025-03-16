import { WithoutId } from "@/sdk/types";
import { API, APIError } from "./api";
import { Ingredient, Dish, Menu, ID } from "./types";
import { writeFile, readFile, mkdir } from "fs/promises";
import { resolve } from "path";
import { homedir } from "os";
import { existsSync } from "fs";

const DB_PATH = resolve(homedir(), "db");

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

enum StorageKey {
  INGREDIENTS = "ingredients",
  DISHES = "dishes",
  TABLES = "tables",
}

function storageKeyToFilePath(key: StorageKey): string {
  return resolve(DB_PATH, `./${key.valueOf()}.json`);
}

async function getItem<T>(key: StorageKey): Promise<T[]> {
  try {
    const item = await readFile(storageKeyToFilePath(key), {
      encoding: "utf-8",
    });
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

async function setItem<T>(key: StorageKey, value: T[]): Promise<void> {
  if (!existsSync(DB_PATH)) {
    await mkdir(DB_PATH);
  }
  return writeFile(storageKeyToFilePath(key), JSON.stringify(value), {
    encoding: "utf-8",
  });
}

export default {
  async getIngredient(id: ID): Promise<Ingredient> {
    const ingredients = await getItem<Ingredient>(StorageKey.INGREDIENTS);
    const index = ingredients.findIndex((r) => r._id === id);
    if (index !== -1) {
      return ingredients[index];
    }
    throw new APIError(`Ingredient with id = ${id} not found.`);
  },

  async getIngredients(): Promise<Ingredient[]> {
    return getItem<Ingredient>(StorageKey.INGREDIENTS);
  },

  async createIngredient(ingredient: WithoutId<Ingredient>): Promise<ID> {
    const ingredients = await getItem<Ingredient>(StorageKey.INGREDIENTS);
    const id = generateId();
    ingredients.push({
      _id: id,
      ...ingredient,
    });
    await setItem(StorageKey.INGREDIENTS, ingredients);
    return id;
  },

  async updateIngredient(
    id: ID,
    ingredient: Partial<Ingredient>
  ): Promise<void> {
    const ingredients = await getItem<Ingredient>(StorageKey.INGREDIENTS);
    const index = ingredients.findIndex((r) => r._id === id);
    if (index !== -1) {
      ingredients[index] = {
        ...ingredients[index],
        ...ingredient,
      };
      return setItem(StorageKey.INGREDIENTS, ingredients);
    }
    throw new APIError(`Ingredient with id = ${id} not found.`);
  },

  async deleteIngredient(id: ID): Promise<Ingredient> {
    const ingredients = await getItem<Ingredient>(StorageKey.INGREDIENTS);
    const index = ingredients.findIndex((r) => r._id === id);
    if (index !== -1) {
      const [deletedIngredient] = ingredients.splice(index, 1);
      await setItem(StorageKey.INGREDIENTS, ingredients);
      return deletedIngredient;
    }
    throw new APIError("Ingredient not found.");
  },

  async getDish(id: ID): Promise<Dish> {
    const dishes = await getItem<Dish>(StorageKey.DISHES);
    const index = dishes.findIndex((r) => r._id === id);
    if (index !== -1) {
      return dishes[index];
    }
    throw new APIError(`Dish with id = ${id} not found.`);
  },

  async createDish(dish: WithoutId<Dish>): Promise<ID> {
    const dishes = await getItem<Dish>(StorageKey.DISHES);
    const id = generateId();
    dishes.push({
      _id: id,
      ...dish,
    });
    await setItem(StorageKey.DISHES, dishes);
    return id;
  },

  async updateDish(id: string, dish: Partial<Dish>): Promise<Promise<void>> {
    const dishes = await getItem<Dish>(StorageKey.DISHES);
    const index = dishes.findIndex((d) => d._id === id);
    if (index !== -1) {
      dishes[index] = {
        ...dishes[index],
        ...dish,
      };
      await setItem(StorageKey.DISHES, dishes);
    }
  },

  deleteDish(id: string): Dish {
    const dishes = this.getItem<Dish>(this.storageKey.dishes);
    const index = dishes.findIndex((d) => d.id === id);
    if (index !== -1) {
      const [deletedDish] = dishes.splice(index, 1);
      this.setItem(this.storageKey.dishes, dishes);
      return deletedDish;
    }
    throw new APIError("Dish not found.");
  },

  createMenu(menu: Omit<Menu, "id">): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    tables.push({
      id: generateId(),
      ...menu,
    });
    this.setItem(this.storageKey.tables, tables);
  },

  deleteMenu(id: string): Menu {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const index = tables.findIndex((t) => t.id === id);
    if (index !== -1) {
      const [deletedTable] = tables.splice(index, 1);
      this.setItem(this.storageKey.tables, tables);
      return deletedTable;
    }
    throw new APIError("Menu not found.");
  },

  cleanMenu(id: string): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const table = tables.find((t) => t.id === id);
    if (table) {
      table.dishes = [];
      this.setItem(this.storageKey.tables, tables);
    }
  },

  addDishToMenu(tableId: string, dish: Dish): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      table.dishes.push({
        dish,
        portions: 1,
      });
      this.setItem(this.storageKey.tables, tables);
    }
  },

  removeDishFromMenu(tableId: string, dishId: string): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      table.dishes = table.dishes.filter((d) => d.dish.id !== dishId);
      this.setItem(this.storageKey.tables, tables);
    }
  },

  getMenus(): Menu[] {
    return getItem<Menu>(StorageKey.TABLES);
  },

  getDishes(): Dish[] {
    return getItem<Dish>(StorageKey.DISHES);
  },

  getIngredients(): Ingredient[] {
    return getItem<Ingredient>(StorageKey.INGREDIENTS);
  },

  incrementDishInMenu(tableId: string, dishId: string): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      const dish = table.dishes.find((d) => d.dish.id === dishId);
      if (dish) {
        dish.portions++;
        this.setItem(this.storageKey.tables, tables);
      }
    }
  },
  decrementDishInMenu(tableId: string, dishId: string): void {
    const tables = this.getItem<Menu>(this.storageKey.tables);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      const dish = table.dishes.find((d) => d.dish.id === dishId);
      if (dish && dish.portions > 0) {
        dish.portions--;
        this.setItem(this.storageKey.tables, tables);
      }
    }
  },
} as API;
