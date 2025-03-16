import { Button } from "@/components/ui/button";
import MenusOverview from "@/app/ui/menu/overview";
import { Link } from "@/i18n/routing";
import { API } from "@/sdk";
import React from "react";

// const tables: Menu[] = [
//   {
//     id: "1",
//     description: "Наш стол на новый год 2024-2025",
//     name: "Новогодний Стол",
//     participants: [],
//     dishes: [
//       {
//         dish: {
//           id: "1",
//           description: "Салат",
//           name: "Оливье",
//           ingredients: [],
//         },
//         portions: 4,
//       },
//     ],
//   },
// ];
export default async function Menus() {
  const menus = await API.getMenus();
  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <MenusOverview menus={menus}></MenusOverview>
    </div>
  );
}
