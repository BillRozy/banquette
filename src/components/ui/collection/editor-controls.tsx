import React from "react";
import SaveButton from "./save-button";
import DeleteButton from "./delete-button";

export default function EditorControls<T>({
  deleteHref,
  formId,
  noSaveButton,
  noDeleteButton,
}: {
  deleteHref?: string;
  formId: string;
  noSaveButton?: boolean;
  noDeleteButton?: boolean;
}) {
  return (
    <div className="flex gap-4 justify-center items-center">
      {!noSaveButton && <SaveButton form={formId}></SaveButton>}
      {!noDeleteButton && deleteHref != null && (
        <DeleteButton href={deleteHref}></DeleteButton>
      )}
    </div>
  );
}
