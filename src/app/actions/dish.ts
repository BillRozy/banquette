"use server";

import {
  buildCreateAction,
  buildDeleteAction,
  buildEditAction,
} from "./editor-actions-builder";
import { DishSchema, EntityEnumSchema, IDSchema } from "@/sdk/schemas";

export const editAction = buildEditAction(
  EntityEnumSchema.enum.Dish,
  DishSchema
);

export const deleteAction = buildDeleteAction(EntityEnumSchema.enum.Dish);

export const createAction = buildCreateAction(
  EntityEnumSchema.enum.Dish,
  DishSchema
);
