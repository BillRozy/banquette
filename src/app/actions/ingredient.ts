"use server";

import {
  buildCreateAction,
  buildDeleteAction,
  buildEditAction,
} from "./editor-actions-builder";
import { EntityEnumSchema, IngredientSchema } from "@/sdk/schemas";

export const editAction = buildEditAction(
  EntityEnumSchema.enum.Ingredient,
  IngredientSchema
);
export const deleteAction = buildDeleteAction(EntityEnumSchema.enum.Ingredient);

export const createAction = buildCreateAction(
  EntityEnumSchema.enum.Ingredient,
  IngredientSchema
);
