import { WithId } from "@/sdk/types";

export type EditorProps<T> = {
  redirect?: string;
  noSaveButton?: boolean;
  noDeleteButton?: boolean;
  formId?: string;
  readonly?: boolean;
  entity?: Partial<WithId<T>>;
  submitAction?: (entity: Partial<WithId<T>>) => Promise<void>;
};
