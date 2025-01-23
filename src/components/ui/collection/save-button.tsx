import React from "react";
import { Button } from "../button";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SaveButton({ form }: { form?: string }) {
  const t = useTranslations("Components.SaveButton");

  return (
    <Button form={form} type="submit">
      <Save></Save>
      {t("save")}
    </Button>
  );
}
