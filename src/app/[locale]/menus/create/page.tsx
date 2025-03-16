import MenuEditor from "@/app/ui/menu/editor";
import { API } from "@/sdk";
import React from "react";

export default async function MenuCreate() {
  const [dishes] = await API.getDishes();
  return <MenuEditor dishes={dishes}></MenuEditor>;
}
