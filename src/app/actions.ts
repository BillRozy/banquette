"use server";

import { API } from "@/sdk";
import { Dish, Menu, ID, UserID } from "@/sdk/types";

import { redirect } from "@/i18n/routing";

import { getLocale } from "next-intl/server";
import { userCanModifyEntity, auth } from "./auth";
import { AuthError } from "next-auth";

export const dishDeleteAction = async (dishId: ID) => {
  const dish = await API.getDish(dishId);
  const canModify = await userCanModifyEntity(dish);
  if (canModify) {
    await API.deleteDish(dishId);
    const locale = await getLocale();
    redirect({
      href: "/dishes",
      locale,
    });
  } else {
    throw new AuthError("You are not allowed to delete this dish");
  }
};

export const dishCreateAction = async (dish: Omit<Dish, "createdBy">) => {
  const session = await auth();
  if (session?.user == null || session.user.id == null) {
    throw new AuthError("You are not allowed to create a dish");
  }
  await API.createDish({ ...dish, createdBy: session.user.id as UserID });
};

export const dishEditAction = async (id: ID, dish: Partial<Dish>) => {
  const canEdit = await userCanModifyEntity(await API.getDish(id));
  if (canEdit) {
    return API.updateDish(id, dish);
  }
  throw new AuthError("You are not allowed to edit this dish");
};

export const menuCreateAction = async (menu: Omit<Menu, "createdBy">) => {
  const session = await auth();
  if (session?.user == null || session.user.id == null) {
    throw new AuthError("You are not allowed to create a menu");
  }
  await API.createMenu({ ...menu, createdBy: session.user.id as UserID });
};

export const menuEditAction = async (id: ID, menu: Partial<Menu>) => {
  const canEdit = await userCanModifyEntity(await API.getMenu(id));
  if (canEdit) {
    return API.updateMenu(id, menu);
  }
  throw new AuthError("You are not allowed to edit this menu");
};
