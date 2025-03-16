import { actionClient } from "../services/action-client";
import { EntitySchema, IDSchema } from "../../sdk/schemas";
import { getCreateSchema, getEditSchema } from "./editor-schema";
import { auth, userCanModifyEntity } from "../auth";
import { API } from "@/sdk";
import { Entity, EntityEnum, UserID, WithoutId } from "@/sdk/types";
import { uploadEntityImage } from "../services/cloudinary";
import { z } from "zod";
import { createFailureResponse, createSuccessResponse } from "./utils";

export function buildEditAction<
  Schema extends typeof EntitySchema,
  T extends Entity
>(entityName: EntityEnum, entitySchema: Schema) {
  return actionClient
    .schema(getEditSchema(entitySchema))
    .action(async ({ parsedInput: { id, entity, picture } }) => {
      const entityBeforeEdit = await API.getEntity<T>(entityName, id);
      const canModify = await userCanModifyEntity(entityBeforeEdit);
      if (canModify) {
        try {
          await API.updateEntity<T>(entityName, id, entity as Partial<T>);
        } catch (err) {
          return createFailureResponse("Update failure", err as Error);
        }
        if (picture) {
          try {
            await uploadEntityImage(entityName, id, picture);
          } catch (err) {
            return createFailureResponse("Image upload failure", err as Error);
          }
        }
        return createSuccessResponse("Item was updated");
      }
      return createFailureResponse("You are not allowed to edit this item");
    });
}

export function buildCreateAction<
  Schema extends typeof EntitySchema,
  T extends Entity
>(entityName: EntityEnum, entitySchema: Schema) {
  return actionClient
    .schema(getCreateSchema(entitySchema))
    .action(async ({ parsedInput: { entity, picture } }) => {
      const session = await auth();
      if (session?.user == null || session.user.id == null) {
        return createFailureResponse("You are not allowed to create an item");
      }
      try {
        const insertedID = await API.createEntity<T>(entityName, {
          ...entity,
          createdBy: session.user.id as UserID,
        } as WithoutId<T>);

        if (picture) {
          try {
            await uploadEntityImage(entityName, insertedID, picture);
          } catch (err) {
            return createFailureResponse(
              "Item was created, but picture was not uploaded",
              err as Error
            );
          }
        }
      } catch (err) {
        return createFailureResponse("Item creation failure", err as Error);
      }
      return createSuccessResponse(`Item '${entity.name}' was created`);
    });
}

export function buildDeleteAction<T extends Entity>(entityName: EntityEnum) {
  return actionClient
    .bindArgsSchemas<[id: z.ZodBranded<z.ZodString, "ID">]>([IDSchema])
    .action(async ({ bindArgsParsedInputs: [id] }) => {
      const entity = await API.getEntity<T>(entityName, id);
      const canModify = await userCanModifyEntity(entity);
      if (canModify) {
        try {
          await API.deleteDish(id);
        } catch (err) {
          return createFailureResponse("Item delete failure", err as Error);
        }
      } else {
        return createFailureResponse("You are not allowed to delete this item");
      }
      return createSuccessResponse("Item was deleted");
    });
}
