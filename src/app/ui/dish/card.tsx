import { Dish, WithId } from "@/sdk/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import IngredientsList from "./ingredients-list";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import DishImage from "./dish-image";

export default function DishCard({ dish }: { dish: WithId<Dish> }) {
  const t = useTranslations("DishCard");
  return (
    <Card className="min-w-72 lg:min-w-56 overflow-hidden max-w-xs">
      <CardHeader className="p-0 relative min-h-24">
        <DishImage
          id={dish._id}
          className="w-full h-full object-cover absolute bg-gray-700 z-0"
        ></DishImage>
        <div
          className="z-10 w-full h-full bg-gray-900/70 absolute"
          style={{ marginTop: 0 }}
        >
          <CardTitle className="text-2xl text-gray-200 p-4">
            <Link className="hover:underline" href={`/dishes/${dish._id}`}>
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
    </Card>
  );
}
