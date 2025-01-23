import React, { PropsWithChildren } from "react";
import Breadcrumbs from "../breadcrumbs";
import { SidebarTrigger } from "../../sidebar";
import { Separator } from "@radix-ui/react-separator";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger></SidebarTrigger>
        <Separator></Separator>
        <Breadcrumbs></Breadcrumbs>
      </header>
      <main className="flex flex-1 flex-col p-4 md:p-8 gap-4">{children}</main>
    </>
  );
}
