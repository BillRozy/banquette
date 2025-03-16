"use client";
import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";
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
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ActionError,
  ActionResponse,
  checkResponseIsError,
  checkResponseIsSuccess,
} from "@/app/actions/utils";
import { HookSafeActionFn, useAction } from "next-safe-action/hooks";
import { z } from "zod";
import { useRouter } from "@/i18n/routing";

export default function DeleteButtonWithConfirmation({
  deleteAction,
  confirmationQuestion,
  confirmationDescription,
  redirect,
}: {
  deleteAction: HookSafeActionFn<
    any,
    undefined,
    [z.ZodBranded<z.ZodString, "ID">],
    any,
    any,
    ActionResponse<undefined> | ActionResponse<ActionError>
  >;
  confirmationQuestion: string;
  confirmationDescription?: string;
  redirect?: string;
}) {
  const t = useTranslations("Components.DeleteButton");
  const { replace } = useRouter();
  const {
    execute,
    result: { data },
  } = useAction(deleteAction);
  useEffect(() => {
    if (!data) return;
    if (checkResponseIsError(data)) {
      toast.error("Deletion failure", {
        description: data?.message,
      });
    }
    if (checkResponseIsSuccess(data)) {
      toast.success("It was deleted");
      if (redirect) {
        replace(redirect);
      }
    }
  }, [data]);

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
            <Button
              type="button"
              onClick={() => execute()}
              variant="destructive"
            >
              Подтвердить
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
