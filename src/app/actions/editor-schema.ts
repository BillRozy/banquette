import { z } from "zod";
import { EntitySchema } from "../../sdk/schemas";
import { IDSchema } from "@/sdk/schemas";

export function getEditSchema<T extends typeof EntitySchema>(entitySchema: T) {
  return z.object({
    id: IDSchema,
    entity: entitySchema,
    picture: z.string().optional(),
  });
}

export function getCreateSchema<T extends typeof EntitySchema>(
  entitySchema: T
) {
  return z.object({
    entity: entitySchema.omit({
      createdBy: true,
    }),
    picture: z.string().optional(),
  });
}
