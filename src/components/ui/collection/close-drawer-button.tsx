"use client";
import React, { PropsWithChildren } from "react";
import { DrawerClose } from "../drawer";
import { buttonVariants } from "../button";

export default function CloseDrawerButton({
  children,
  drawerOpenControl,
}: PropsWithChildren & { drawerOpenControl: (open: boolean) => void }) {
  return (
    <DrawerClose
      onClick={() => drawerOpenControl(false)}
      className={buttonVariants({ variant: "ghost", size: "lg" })}
    >
      {children}
    </DrawerClose>
  );
}
