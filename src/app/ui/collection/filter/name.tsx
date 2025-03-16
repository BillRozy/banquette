"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslations } from "next-intl";
import { EntityFilterContext } from "./provider";

export default function NameFilter() {
  const {
    pagination: { resetPagination },
    entityFilters: { setName, name },
    entityName,
  } = use(EntityFilterContext);
  const t = useTranslations(`${entityName}.Search`);
  const [localName, setLocalName] = useState(name);
  const debouncedName = useDebounce(localName, 500);
  useEffect(() => {
    if (debouncedName !== name) {
      resetPagination();
      setName(debouncedName);
    }
  }, [debouncedName, name]);

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder={t("nameInputPlaceholder")}
        value={localName}
        onChange={(val) => setLocalName(val.target.value)}
      />
    </div>
  );
}
