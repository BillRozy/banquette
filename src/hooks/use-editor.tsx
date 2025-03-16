import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useMemo } from "react";
import { z, ZodRawShape } from "zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import {
  ActionError,
  ActionResponse,
  checkResponseIsError,
  checkResponseIsSuccess,
} from "@/app/actions/utils";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { HookSafeActionFn } from "next-safe-action/hooks";
export function useEditor<T extends ZodRawShape>({
  formId,
  formSchema,
  formAction,
  props,
  redirect,
}: {
  redirect?: string;
  formId?: string;
  formSchema: z.ZodObject<T>;
  formAction: HookSafeActionFn<
    any,
    z.ZodObject<T>,
    any,
    any,
    any,
    ActionResponse<undefined> | ActionResponse<ActionError>
  >;
  props: Parameters<typeof useHookFormAction>[2];
}) {
  const id = useId();
  const { replace, refresh } = useRouter();
  const { form, action, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(formAction, zodResolver(formSchema), props);
  const data = action.result.data;
  const resolvedId = useMemo(() => {
    return formId ?? id;
  }, [formId]);
  useEffect(() => {
    if (data) {
      if (checkResponseIsSuccess(data)) {
        toast.success(data.message);
        if (redirect != null) {
          replace(redirect);
        } else {
          refresh();
        }
      } else if (checkResponseIsError(data)) {
        toast.error(data.message, {
          description: data?.data?.message,
        });
        console.error(data.data);
      }
    }
  }, [data]);
  return {
    id: resolvedId,
    form,
    action,
    handleSubmitWithAction,
    resetFormAndAction,
  };
}
