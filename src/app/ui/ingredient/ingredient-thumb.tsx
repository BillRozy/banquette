"use client";
import { ID } from "@/sdk/types";
import React from "react";
import Thumbnail from "@/components/ui/thumbnail";
import { EntityEnumSchema } from "@/sdk/schemas";

export default function IngredientThumb({
  id,
  className,
}: {
  id: ID;
  className?: string;
}) {
  return (
    <Thumbnail
      id={id}
      className={className}
      alt={`picture of the ingredient with id == ${id}`}
      entityType={EntityEnumSchema.enum.Ingredient}
    ></Thumbnail>
  );
}
