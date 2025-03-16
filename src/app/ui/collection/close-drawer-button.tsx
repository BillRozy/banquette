"use client";
import React, { PropsWithChildren } from "react";
import { DrawerClose } from "../../../components/ui/drawer";
import { buttonVariants } from "../../../components/ui/button";

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
