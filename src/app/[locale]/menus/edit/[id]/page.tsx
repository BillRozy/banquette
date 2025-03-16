import { userCanModifyEntity } from "@/app/auth";
import MenuEditor from "@/app/ui/menu/editor";
import { redirect } from "@/i18n/routing";
import { API } from "@/sdk";
import { ID } from "@/sdk/types";
import { getLocale } from "next-intl/server";
import React from "react";

export default async function MenuView({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const [menu, [dishes]] = await Promise.all([
    API.getMenu(id),
    API.getDishes(),
  ]);
  const canEdit = await userCanModifyEntity(menu);
  if (!canEdit) {
    redirect({ href: `/menus/${id}`, locale: await getLocale() });
  }
  return (
    <MenuEditor
      dishes={dishes}
      entity={menu}
      entityId={id}
      readonly={!canEdit} // TODO: participant can do it as well
    ></MenuEditor>
  );
}
