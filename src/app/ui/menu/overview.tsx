import { Menu, WithId } from "@/sdk/types";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";

function MenuCard({ menu }: { menu: WithId<Menu> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/menus/${menu._id}`}>{menu.name}</Link>
        </CardTitle>
        <CardDescription>{menu.description}</CardDescription>
      </CardHeader>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default function MenusOverview({ menus }: { menus: WithId<Menu>[] }) {
  return (
    <Carousel className="w-[90%]">
      <CarouselContent>
        {menus.map((menu) => (
          <CarouselItem key={menu._id} className="basis-1/3">
            <MenuCard menu={menu}></MenuCard>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
