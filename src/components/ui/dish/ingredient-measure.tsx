import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  Dish,
  Ingredient,
  IngredientID,
  MeasuredIngredient,
  Measurement,
  WithId,
} from "@/sdk/types";
import { Control, FieldArrayWithId } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { useTranslations } from "next-intl";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function IngredientMeasure({
  readonly = false,
  control,
  index,
  ingredientDetails,
  remove,
}: {
  readonly?: boolean;
  index: number;
  control: Control<any>;
  ingredientDetails: WithId<Ingredient>;
  remove: () => void;
}) {
  const t = useTranslations("IngredientMeasure");

  return (
    <Card className="max-w-60 divide-y">
      <CardHeader className="p-4 py-2">
        <div className="flex gap-2 items-center">
          <Avatar className="bg-muted">
            <AvatarImage src={ingredientDetails.picture} />
            <AvatarFallback>
              {ingredientDetails.name.substring(0, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-medium text-sm">
            <Link href={`/ingredients/${ingredientDetails._id}`}>
              {ingredientDetails.name}
            </Link>
          </CardTitle>
          <div className="w-full"></div>
          {!readonly && (
            <Button
              variant="secondary"
              className="size-8"
              onClick={() => remove()}
            >
              <Trash2></Trash2>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <FormField
          control={control}
          name={`ingredients.${index}.ingredient`}
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        <FormField
          control={control}
          name={`ingredients.${index}.measure`}
          render={({ field }) => (
            <FormItem>
              <FormLabel hidden>{t("askHowMany")}</FormLabel>
              <FormItem className="flex flex-row gap-2 items-center space-y-0">
                <FormField
                  control={control}
                  name={`ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={readonly}
                          className="min-w-20 max-w-24"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Select
                  disabled={readonly}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectMeasure")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Measurement).map((measure) => (
                      <SelectItem key={measure} value={measure}>
                        {t(measure)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
