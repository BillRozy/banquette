import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z, ZodRawShape } from "zod";

export function useEditor<T extends ZodRawShape>({
  formId,
  formSchema,
  defaultValues,
}: {
  formId?: string;
  formSchema: z.ZodObject<T>;
  defaultValues: any;
}) {
  const id = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const resolvedId = useMemo(() => {
    return formId ?? id;
  }, [formId]);
  return {
    id: resolvedId,
    form,
  };
}
