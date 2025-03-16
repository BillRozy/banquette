import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

export default function EntitiesLayout({
  filters,
  entities,
  pagination,
}: {
  filters: ReactNode;
  entities: ReactNode;
  pagination: ReactNode;
}) {
  return (
    <div className="p-4 flex flex-col gap-8">
      {filters}
      <Separator orientation="horizontal"></Separator>
      {entities}
      <Separator orientation="horizontal"></Separator>
      {pagination}
    </div>
  );
}
