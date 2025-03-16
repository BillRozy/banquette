"use client";
import React from "react";
import { CldImage } from "next-cloudinary";
import clsx from "clsx";
import { EntityEnum } from "@/sdk/types";

export default function Thumbnail({
  entityType,
  id,
  className,
  width = 96,
  height = 96,
  alt,
}: {
  entityType: EntityEnum;
  id: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <CldImage
      alt={alt}
      src={`${entityType.toLowerCase()}-${id}`}
      width={width}
      height={height}
      defaultImage={`${entityType.toLocaleLowerCase()}-default.png`}
      crop={{
        type: "auto",
        source: true,
      }}
      className={clsx(className)}
    />
  );
}
