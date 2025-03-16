import { Entity, ID } from "@/sdk/types";

export type Action<T extends Entity> = (state: Awaited<T>) => Promise<void>;

export type EditorProps<T extends Entity> = {
  formId?: string;
  entityId?: ID;
  readonly?: boolean;
  redirect?: string;
  noSaveButton?: boolean;
  noDeleteButton?: boolean;
  entity?: T;
};
