"use client";
import React from "react";
import { Button, ButtonProps } from "../button";
import { useRouter } from "@/i18n/routing";
import clsx from "clsx";

export default function LinkButton({
  href,
  className,
  ...props
}: ButtonProps & { href: string }) {
  const router = useRouter();
  return (
    <Button
      {...props}
      onClick={() => router.push(href)}
      className={clsx(className, "cursor-pointer justify-start")}
    >
      {props.children}
    </Button>
  );
}
