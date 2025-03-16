import React from "react";
import DishCard from "./card";
import { Dish, WithId } from "@/sdk/types";

export default function DishesOverview({ dishes }: { dishes: WithId<Dish>[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {dishes.length > 0 ? (
        dishes.map((dish) => <DishCard key={dish._id} dish={dish}></DishCard>)
      ) : (
        <div> Nothing found </div>
      )}
    </div>
  );
}
