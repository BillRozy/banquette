import { auth } from "@/app/auth";
import { Button } from "@/components/ui/button";
import IngredientsOverview from "@/components/ui/ingredient/overview";
import { Link } from "@/i18n/routing";
import { API } from "@/sdk";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function Ingredients() {
  const session = await auth();
  const ingredients = await API.getIngredients("sdsa");
  const t = await getTranslations("Ingredients");
  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <IngredientsOverview
        ingredients={ingredients}
        newIngredientSlot={
          session?.user && (
            <Link href="/ingredients/create">
              <Button className="size-24 rounded-full" variant="outline">
                <Plus></Plus>
              </Button>
            </Link>
          )
        }
      ></IngredientsOverview>
    </div>
  );
}
