import { API, APIError, DB_NAME, StorageCollections } from "./api";
import {
  Ingredient,
  Dish,
  Menu,
  IngredientID,
  DishID,
  MenuID,
  WithId as WithSimpleId,
} from "./types";
import { ObjectId, WithoutId, WithId } from "mongodb";
import mongodb from "@/lib/db";

function transformId<T>(r: WithId<T>): WithSimpleId<T> {
  return { ...r, _id: r._id.toString() } as WithSimpleId<T>;
}

function objectivateId<T>(r: WithSimpleId<T>): WithId<T> {
  return { ...r, _id: new ObjectId(r._id) } as WithId<T>;
}

export default {
  async getIngredient(id: IngredientID): Promise<WithSimpleId<Ingredient>> {
    const ingredient = await mongodb
      .db(DB_NAME)
      .collection<WithId<Ingredient>>(StorageCollections.INGREDIENTS)
      .findOne({ _id: new ObjectId(id) });
    if (ingredient == null) {
      throw new APIError(`Ingredient with id = ${id} not found.`);
    }
    return transformId(ingredient);
  },
  async getIngredients(): Promise<WithSimpleId<Ingredient>[]> {
    return mongodb
      .db(DB_NAME)
      .collection<WithId<Ingredient>>(StorageCollections.INGREDIENTS)
      .find()
      .map(transformId)
      .toArray();
  },
  async getDish(id: DishID): Promise<WithSimpleId<Dish>> {
    const dish = await mongodb
      .db(DB_NAME)
      .collection<WithId<Dish>>(StorageCollections.DISHES)
      .findOne({ _id: new ObjectId(id) });
    if (dish == null) {
      throw new APIError(`Dish with id = ${id} not found.`);
    }
    return transformId(dish);
  },
  async getDishes(): Promise<WithSimpleId<Dish>[]> {
    return mongodb
      .db(DB_NAME)
      .collection<Dish>(StorageCollections.DISHES)
      .find()
      .map(transformId)
      .toArray();
  },
  async getMenus(): Promise<WithSimpleId<Menu>[]> {
    return mongodb
      .db(DB_NAME)
      .collection<Menu>(StorageCollections.MENUS)
      .find()
      .map(transformId)
      .toArray();
  },
  async addDishToMenu(tableId: MenuID, dishId: DishID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne(
        { _id: new ObjectId(tableId) },
        { $set: { [`dishes.${dishId}`]: 1 } }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${tableId} not found.`);
    }
  },
  async removeDishFromMenu(tableId: MenuID, dishId: MenuID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne(
        { _id: new ObjectId(tableId) },
        { $unset: { [`dishes.${dishId}`]: "" } }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${tableId} not found.`);
    }
  },

  async createIngredient(
    ingredient: WithoutId<Ingredient>
  ): Promise<IngredientID> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithoutId<Ingredient>>(StorageCollections.INGREDIENTS)
      .insertOne(ingredient);
    return result.insertedId.toString();
  },

  async updateIngredient(
    id: IngredientID,
    ingredient: WithSimpleId<Partial<Ingredient>>
  ): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<Partial<WithId<Ingredient>>>(StorageCollections.INGREDIENTS)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: objectivateId(ingredient) }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Ingredient with id = ${id} not found.`);
    }
  },

  async deleteIngredient(id: IngredientID): Promise<void> {
    const session = mongodb.startSession();
    try {
      session.startTransaction();
      let result = await mongodb
        .db(DB_NAME)
        .collection<WithId<Ingredient>>(StorageCollections.INGREDIENTS)
        .findOneAndDelete({ _id: new ObjectId(id) });
      if (result == null) {
        throw new APIError(`Ingredient with id = ${id} not found.`);
      }
      // next let's update dishes
      await mongodb
        .db(DB_NAME)
        .collection<WithId<Dish>>(StorageCollections.DISHES)
        .updateMany(
          {},
          {
            $pull: {
              ingredients: {
                ingredient: id,
              },
            },
          }
        );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },

  async createDish(dish: WithoutId<Dish>): Promise<DishID> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithoutId<Dish>>(StorageCollections.DISHES)
      .insertOne(dish);
    return result.insertedId.toString();
  },

  async updateDish(
    id: DishID,
    dish: WithSimpleId<Partial<Dish>>
  ): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Partial<Dish>>>(StorageCollections.DISHES)
      .updateOne({ _id: new ObjectId(id) }, { $set: objectivateId(dish) });
    if (result.matchedCount === 0) {
      throw new APIError(`Dish with id = ${id} not found.`);
    }
  },

  async deleteDish(id: DishID): Promise<void> {
    const session = mongodb.startSession();
    try {
      session.startTransaction();
      let result = await mongodb
        .db(DB_NAME)
        .collection<WithId<Dish>>(StorageCollections.DISHES)
        .findOneAndDelete({ _id: new ObjectId(id) });
      if (result == null) {
        throw new APIError(`Dish with id = ${id} not found.`);
      }
      // next let's update tables
      await mongodb
        .db(DB_NAME)
        .collection<WithId<Menu>>(StorageCollections.MENUS)
        .updateMany(
          {},
          {
            $unset: {
              [`dishes.${id}`]: "",
            },
          }
        );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },

  async createMenu(menu: WithoutId<Menu>): Promise<MenuID> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithoutId<Menu>>(StorageCollections.MENUS)
      .insertOne(menu);
    return result.insertedId.toString();
  },

  async deleteMenu(id: MenuID): Promise<WithSimpleId<Menu>> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .findOneAndDelete({ _id: new ObjectId(id) });
    if (result == null) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
    return transformId(result);
  },

  async cleanMenu(id: MenuID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne({ _id: new ObjectId(id) }, { $set: { dishes: {} } });
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
  },

  async incrementDishInMenu(tableId: MenuID, dishId: DishID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne(
        { _id: new ObjectId(tableId) },
        { $inc: { [`dishes.${dishId}`]: 1 } }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${tableId} not found.`);
    }
  },

  async decrementDishInMenu(tableId: MenuID, dishId: DishID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne(
        { _id: new ObjectId(tableId) },
        { $inc: { [`dishes.${dishId}`]: -1 } }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${tableId} not found.`);
    }
  },
} as API;
