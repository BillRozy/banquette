import { ID } from "./../sdk/types";
import { EntityEnum } from "@/sdk/types";
import { API, APIError, DB_NAME, StorageCollections } from "../sdk/api";
import {
  Ingredient,
  Dish,
  Menu,
  WithId as WithSimpleId,
  EntityFindBy,
  Entity,
} from "../sdk/types";
import {
  ObjectId,
  WithoutId,
  WithId,
  Filter,
  OptionalUnlessRequiredId,
} from "mongodb";
import mongodb from "@/app/services/mongo";
import { EntityEnumSchema } from "@/sdk/schemas";

function transformId<T>(r: WithId<T>): WithSimpleId<T> {
  return { ...r, _id: r._id.toString() } as WithSimpleId<T>;
}

export function objectivateId<T>(r: WithSimpleId<T>): WithId<T> {
  return { ...r, _id: new ObjectId(r._id) } as WithId<T>;
}

function entityToCollection(entity: EntityEnum): StorageCollections {
  switch (entity) {
    case EntityEnumSchema.enum.Ingredient:
      return StorageCollections.INGREDIENTS;
    case EntityEnumSchema.enum.Dish:
      return StorageCollections.DISHES;
    case EntityEnumSchema.enum.Menu:
      return StorageCollections.MENUS;
    default:
      throw new APIError(
        `Don't have collection mapping for entity '${entity}'`
      );
  }
}

export default {
  async getEntity<T extends Entity>(entity: EntityEnum, id: string) {
    const inst = await mongodb
      .db(DB_NAME)
      .collection<WithId<T>>(entityToCollection(entity))
      .findOne({ _id: new ObjectId(id) } as Filter<WithId<T>>);
    if (inst == null) {
      throw new APIError(`Entity '${entity}' with id = ${id} was not found.`);
    }
    return transformId(inst);
  },
  async getEntities<E extends Entity>(
    entity: EntityEnum,
    { filter = {}, pagination: { perPage = 25, page = 1 } = {} }: EntityFindBy
  ) {
    const findObject = {} as {
      _id: any;
      name: any;
      createdBy: any;
      category: any;
    };
    if (filter.ids) {
      findObject._id = { $in: filter.ids.map((id) => new ObjectId(id)) };
    }
    if (filter.nameLike) {
      findObject["name"] = { $regex: filter.nameLike, $options: "i" };
    }
    if (filter.createdBy) {
      findObject["createdBy"] = filter.createdBy;
    }
    if (filter.categories) {
      findObject["category"] = {
        $in: filter.categories,
      };
    }
    const collection = mongodb
      .db(DB_NAME)
      .collection<WithId<E>>(entityToCollection(entity));

    return Promise.all([
      collection
        .find(findObject as Filter<WithId<E>>)
        .sort({
          name: 1,
          _id: 1,
        })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .map(transformId)
        .toArray(),
      collection.countDocuments(findObject as Filter<WithId<E>>),
    ]);
  },
  async getEntityCategories<E extends Entity>(
    entity: EntityEnum
  ): Promise<[string, number][]> {
    const pipeline = [
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category",
          count: { $count: {} },
        },
      },
    ];
    return mongodb
      .db(DB_NAME)
      .collection<WithId<E>>(entityToCollection(entity))
      .aggregate<{
        _id: string;
        count: number;
      }>(pipeline)
      .sort({
        _id: 1,
      })
      .map<[string, number]>((it) => [it._id, it.count])
      .toArray();
  },
  async createEntity<E extends Entity>(
    entityName: EntityEnum,
    entityData: WithoutId<E>
  ) {
    const result = await mongodb
      .db(DB_NAME)
      .collection<E>(entityToCollection(entityName))
      .insertOne(entityData as OptionalUnlessRequiredId<E>);
    return result.insertedId.toString();
  },
  async updateEntity<E extends Entity>(
    entityName: EntityEnum,
    id: ID,
    entityData: Partial<E>
  ) {
    const result = await mongodb
      .db(DB_NAME)
      .collection<E>(entityToCollection(entityName))
      .updateOne(
        // @ts-ignore: 2345
        { _id: new ObjectId(id) },
        {
          $set: entityData,
        }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Entity with id = ${id} not found.`);
    }
  },
  async deleteEntity<E extends Entity>(entityName: EntityEnum, id: ID) {
    let result = await mongodb
      .db(DB_NAME)
      .collection<WithId<E>>(entityToCollection(entityName))
      // @ts-ignore: 2345
      .findOneAndDelete({ _id: new ObjectId(id) });
    if (result == null) {
      throw new APIError(`Entity with id = ${id} not found.`);
    }
  },
  async getIngredientsCategories() {
    return this.getEntityCategories<Ingredient>(
      EntityEnumSchema.enum.Ingredient
    );
  },
  async getIngredient(id: ID): Promise<WithSimpleId<Ingredient>> {
    return this.getEntity(EntityEnumSchema.enum.Ingredient, id);
  },
  async getIngredients(
    criterio: EntityFindBy = {}
  ): Promise<[WithSimpleId<Ingredient>[], number]> {
    return this.getEntities(EntityEnumSchema.enum.Ingredient, criterio);
  },
  async getDishCategories() {
    return this.getEntityCategories<Dish>(EntityEnumSchema.enum.Dish);
  },
  async getDish(id: ID): Promise<WithSimpleId<Dish>> {
    return this.getEntity(EntityEnumSchema.enum.Dish, id);
  },
  async getDishes(
    criterio: EntityFindBy = {}
  ): Promise<[WithSimpleId<Dish>[], number]> {
    return this.getEntities(EntityEnumSchema.enum.Dish, criterio);
  },
  async getMenus(): Promise<WithSimpleId<Menu>[]> {
    return mongodb
      .db(DB_NAME)
      .collection<Menu>(StorageCollections.MENUS)
      .find()
      .map(transformId)
      .toArray();
  },
  async addDishToMenu(tableId: ID, dishId: ID): Promise<void> {
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
  async removeDishFromMenu(tableId: ID, dishId: ID): Promise<void> {
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

  async createIngredient(ingredient: WithoutId<Ingredient>): Promise<ID> {
    return this.createEntity(EntityEnumSchema.enum.Ingredient, ingredient);
  },

  async updateIngredient(
    id: ID,
    ingredient: Partial<Ingredient>
  ): Promise<void> {
    return this.updateEntity(EntityEnumSchema.enum.Ingredient, id, ingredient);
  },

  async deleteIngredient(id: ID): Promise<void> {
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

  async createDish(dish: WithoutId<Dish>): Promise<ID> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithoutId<Dish>>(StorageCollections.DISHES)
      .insertOne(dish);
    return result.insertedId.toString() as ID;
  },

  async updateDish(id: ID, dish: Partial<Dish>): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Partial<Dish>>>(StorageCollections.DISHES)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: dish,
        }
      );
    if (result.matchedCount === 0) {
      throw new APIError(`Dish with id = ${id} not found.`);
    }
  },

  async deleteDish(id: ID): Promise<void> {
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

  async getMenu(id: ID): Promise<WithSimpleId<Menu>> {
    const menu = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .findOne({ _id: new ObjectId(id) });
    if (menu == null) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
    return transformId(menu);
  },

  async createMenu(menu: WithoutId<Menu>): Promise<ID> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithoutId<Menu>>(StorageCollections.MENUS)
      .insertOne(menu);
    return result.insertedId.toString() as ID;
  },

  async updateMenu(id: ID, menu: Partial<Menu>): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<Partial<WithId<Menu>>>(StorageCollections.MENUS)
      .updateOne({ _id: new ObjectId(id) }, { $set: menu });
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
  },

  async deleteMenu(id: ID): Promise<WithSimpleId<Menu>> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .findOneAndDelete({ _id: new ObjectId(id) });
    if (result == null) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
    return transformId(result);
  },

  async cleanMenu(id: ID): Promise<void> {
    const result = await mongodb
      .db(DB_NAME)
      .collection<WithId<Menu>>(StorageCollections.MENUS)
      .updateOne({ _id: new ObjectId(id) }, { $set: { dishes: [] } });
    if (result.matchedCount === 0) {
      throw new APIError(`Menu with id = ${id} not found.`);
    }
  },

  async incrementDishInMenu(tableId: ID, dishId: ID): Promise<void> {
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

  async decrementDishInMenu(tableId: ID, dishId: ID): Promise<void> {
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
