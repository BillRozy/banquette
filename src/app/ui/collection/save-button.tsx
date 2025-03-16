"use client";
import React from "react";
import { Button, ButtonProps } from "../../../components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SaveButton({
  loading = false,
  disabled = false,
  ...props
}: ButtonProps & { loading?: boolean }) {
  const t = useTranslations("Components.SaveButton");
  return (
    <Button {...props} type="submit" disabled={loading || disabled}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          {t("loading")}
        </>
      ) : (
        <>
          <Save></Save>
          {t("save")}
        </>
      )}
    </Button>
  );
}
