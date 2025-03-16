"use server";

import {
  buildCreateAction,
  buildDeleteAction,
  buildEditAction,
} from "./editor-actions-builder";
import { EntityEnumSchema, MenuSchema } from "@/sdk/schemas";

export const editAction = buildEditAction(
  EntityEnumSchema.enum.Menu,
  MenuSchema
);
export const deleteAction = buildDeleteAction(EntityEnumSchema.enum.Menu);

export const createAction = buildCreateAction(
  EntityEnumSchema.enum.Menu,
  MenuSchema
);
