import React from "react";
import LinkButton from "./linkbutton";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditButton({
  href,
  title,
}: {
  href: string;
  title?: string;
}) {
  const t = useTranslations("Components.EditButton");
  return (
    <LinkButton href={href} title={title}>
      <Edit></Edit>
      {t("edit")}
    </LinkButton>
  );
}
