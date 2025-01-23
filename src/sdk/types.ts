export type ID = string;
export type UserID = ID;
export type IngredientID = ID;
export type DishID = ID;
export type MenuID = ID;

export enum Measurement {
  KG = "kg",
  GRAMM = "gramm",
  ITEM = "item",
}

export type WithId<T> = T & { _id: ID };
export type WithoutId<T> = Omit<T, "_id">;

type Entity = {
  name: string;
  description: string;
  createdBy: UserID;
  updatedBy?: UserID;
};

export type User = WithId<{
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
}>;

export type IngredientPrices = {
  [Measurement.GRAMM]?: number;
  [Measurement.KG]?: number;
  [Measurement.ITEM]?: number;
};

export type Ingredient = {
  picture?: string;
} & Entity;

export type MeasuredIngredient = {
  ingredient: IngredientID;
  measure: Measurement;
  quantity: number;
};

export type Dish = {
  picture?: string;
  ingredients: MeasuredIngredient[];
} & Entity;

export type Menu = {
  dishes: {
    [key: DishID]: number; // portions of dishes
  };
  participants: UserID[];
} & Entity;
