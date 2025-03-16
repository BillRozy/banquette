import React from "react";
import SaveButton from "./save-button";

export default function EditorControls({
  actionPending = false,
  formId,
  noSaveButton,
}: {
  actionPending?: boolean;
  formId: string;
  noSaveButton?: boolean;
}) {
  return (
    <div className="flex gap-4 justify-center items-center">
      {!noSaveButton && (
        <SaveButton form={formId} loading={actionPending}></SaveButton>
      )}
    </div>
  );
}
