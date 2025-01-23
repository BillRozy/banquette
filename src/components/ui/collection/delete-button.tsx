import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import LinkButton from "./linkbutton";
import { Button } from "../button";

export default function DeleteButton({
  hrefOrFunction,
}: {
  hrefOrFunction: string | (() => void);
}) {
  const t = useTranslations("Components.DeleteButton");
  if (typeof hrefOrFunction === "string") {
    return (
      <LinkButton href={hrefOrFunction} variant="destructive">
        <Trash2></Trash2>
        {t("delete")}
      </LinkButton>
    );
  } else {
    return (
      <Button variant="destructive" onClick={hrefOrFunction}>
        <Trash2></Trash2>
        {t("delete")}
      </Button>
    );
  }
}
