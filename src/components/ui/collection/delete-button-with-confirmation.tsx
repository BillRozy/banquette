import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";

export default function DeleteButtonWithConfirmation({
  deleteAction,
  confirmationQuestion,
  confirmationDescription,
}: {
  deleteAction: () => Promise<void>;
  confirmationQuestion: string;
  confirmationDescription?: string;
}) {
  const t = useTranslations("Components.DeleteButton");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2></Trash2>
          {t("delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmationQuestion}</AlertDialogTitle>
          {confirmationDescription && (
            <AlertDialogDescription>
              {confirmationDescription}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button type="button" onClick={deleteAction} variant="destructive">
              Подтвердить
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
