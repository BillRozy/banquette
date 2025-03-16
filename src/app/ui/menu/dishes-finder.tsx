import React, { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Dish, ID, WithId } from "@/sdk/types";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function DishesFinder({
  dishes,
  selectedDishes,
  selector,
}: {
  dishes: WithId<Dish>[];
  selectedDishes: string[];
  selector: (dishId: ID) => void;
}) {
  const t = useTranslations("DishesFinder");
  const router = useRouter();
  const availableDishes = useMemo(() => {
    return dishes.filter((it) => !selectedDishes.includes(it._id));
  }, [dishes, selectedDishes]);
  return (
    <ul className="flex flex-col">
      {availableDishes.length === 0 && <span>{t("nothingFound")}</span>}
      {availableDishes.map((it) => (
        <Button key={it._id} variant="ghost" onClick={() => selector(it._id)}>
          {it.name}
        </Button>
      ))}
      <Button variant={"outline"} onClick={() => router.push("/dishes/create")}>
        {t("createDish")}
      </Button>
    </ul>
  );
}
