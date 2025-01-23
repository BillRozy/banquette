import React, { Suspense } from "react";
import DishCard from "./card";
import { API } from "@/sdk";

export default async function DishesOverview() {
  const dishes = await API.getDishes();
  return (
    <Suspense>
      <div className="flex flex-row flex-wrap gap-4">
        {dishes.length > 0 ? (
          dishes.map((dish) => <DishCard key={dish._id} dish={dish}></DishCard>)
        ) : (
          <div> Nothing found </div>
        )}
      </div>
    </Suspense>
  );
}
