import { z } from "zod";
import {
  DishCategoryEnumSchema,
  DishInMenuSchema,
  DishSchema,
  EntityEnumSchema,
  EntityFilterSchema,
  EntitySchema,
  IDSchema,
  IngredientCategoryEnumSchema,
  IngredientSchema,
  MassMeasurementEnumSchema,
  MeasuredIngredientSchema,
  MeasurementEnumSchema,
  MenuSchema,
  MenuSectionEnumSchema,
  OtherMeasurementEnumSchema,
  PaginationFilterSchema,
  PrivateFilterEnumSchema,
  UserIDSchema,
  UserRoleEnumSchema,
  UserSchema,
  VolumeMeasurementEnumSchema,
} from "./schemas";
export type ID = z.infer<typeof IDSchema>;
export type UserID = z.infer<typeof UserIDSchema>;

export type UserRole = z.infer<typeof UserRoleEnumSchema>;

export type MassMeasurement = z.infer<typeof MassMeasurementEnumSchema>;
export type VolumeMeasurement = z.infer<typeof VolumeMeasurementEnumSchema>;
export type OtherMeasurement = z.infer<typeof OtherMeasurementEnumSchema>;

export type Measurement = z.infer<typeof MeasurementEnumSchema>;

export type WithId<T> = T & { _id: ID };
export type WithoutId<T> = Omit<T, "_id">;

export type EntityEnum = z.infer<typeof EntityEnumSchema>;

export type PrivateFilterEnum = z.infer<typeof PrivateFilterEnumSchema>;

export type Entity = z.infer<typeof EntitySchema>;

export type EntityFilter = z.infer<typeof EntityFilterSchema>;

export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;

export type EntityFindBy = {
  filter?: EntityFilter;
  pagination?: PaginationFilter;
};

export type User = z.infer<typeof UserSchema>;

export type IngredientCategory = z.infer<typeof IngredientCategoryEnumSchema>;

export type Ingredient = z.infer<typeof IngredientSchema>;

export type MeasuredIngredient = z.infer<typeof MeasuredIngredientSchema>;

export type DishCategory = z.infer<typeof DishCategoryEnumSchema>;

export type Dish = z.infer<typeof DishSchema>;

export type MenuSection = z.infer<typeof MenuSectionEnumSchema>;

export type DishInMenu = z.infer<typeof DishInMenuSchema>;

export type Menu = z.infer<typeof MenuSchema>;
