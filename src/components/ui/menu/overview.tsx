import { Menu } from "@/sdk/types";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../badge";

function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{menu.name}</CardTitle>
        <CardDescription>{menu.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {menu.dishes.map((dish) => (
          <Badge key={dish}>
            {dish.dish.name}: {dish.portions}
          </Badge>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default function MenusOverview({ menus }: { menus: Menu[] }) {
  return (
    <Carousel className="w-[90%]">
      <CarouselContent>
        {menus.map((menu) => (
          <CarouselItem key={menu.id}>
            <MenuCard menu={menu}></MenuCard>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
