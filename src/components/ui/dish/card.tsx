import { Dish, WithId } from "@/sdk/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { getTranslations } from "next-intl/server";
import { Separator } from "../separator";
import IngredientsList from "./ingredients-list";
import LinkButton from "../collection/linkbutton";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function DishCard({ dish }: { dish: WithId<Dish> }) {
  const t = await getTranslations("DishCard");
  return (
    <Card className="min-w-80 lg:min-w-56 overflow-hidden max-w-md">
      <CardHeader className="p-0 relative min-h-24">
        <img
          src={dish.picture ? dish.picture : "/globe.svg"}
          alt="picture of the dish"
          className="w-full h-full object-cover absolute bg-gray-700 z-0"
        ></img>
        <div
          className="z-10 w-full h-full bg-gray-900/50 absolute"
          style={{ marginTop: 0 }}
        >
          <CardTitle className="text-2xl text-gray-200 p-4">
            <Link className=" hover:underline" href={`/dishes/${dish._id}`}>
              {dish.name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <Separator></Separator>
      <CardDescription className="p-6">{dish.description}</CardDescription>
      <Separator></Separator>
      <CardContent className="py-4">
        <IngredientsList ingredients={dish.ingredients}></IngredientsList>
      </CardContent>
      {/* <Separator></Separator>
      <CardFooter className="py-4">
        <div className="flex gap-2 mx-auto">
          <LinkButton
            variant="outline"
            size="icon"
            href={`/dishes/edit/${dish._id}`}
            title="TBD"
          >
            <Edit></Edit>
          </LinkButton>

          <LinkButton
            variant="outline"
            size="icon"
            href={`/dishes/delete/${dish._id}`}
            title="TBD"
          >
            <Trash2></Trash2>
          </LinkButton>
        </div>
      </CardFooter> */}
    </Card>
  );
}
