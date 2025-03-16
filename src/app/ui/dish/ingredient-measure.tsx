"use client";
import React, { Usable, use } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Ingredient, Measurement, WithId } from "@/sdk/types";
import { Control } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";

import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import IngredientThumb from "../ingredient/ingredient-thumb";
import { GroupedMeasurements } from "@/sdk/schemas";

export default function IngredientMeasure({
  readonly = false,
  control,
  index,
  ingredientUsable,
  remove,
}: {
  readonly?: boolean;
  index: number;
  control: Control<any>;
  ingredientUsable: Usable<WithId<Ingredient>>;
  remove: () => void;
}) {
  const t = useTranslations("IngredientMeasure");
  const ingredientDetails = use(ingredientUsable);

  return (
    <Card className="max-w-60 divide-y">
      <CardHeader className="p-4 py-2">
        <div className="flex gap-2 items-center">
          <div className="min-w-10 size-10 relative rounded-full overflow-hidden shadow-sm shadow-gray-700/20">
            <IngredientThumb
              id={ingredientDetails._id}
              className="object-fit w-full h-full z-0 absolute"
            ></IngredientThumb>
          </div>
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
          name={`entity.ingredients.${index}.ingredient`}
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        <FormField
          control={control}
          name={`entity.ingredients.${index}.measure`}
          render={({ field }) => (
            <FormItem>
              <FormLabel hidden>{t("askHowMany")}</FormLabel>
              <FormItem className="flex flex-row gap-2 items-center space-y-0">
                <FormField
                  control={control}
                  name={`entity.ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          min={0}
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
                    {Object.entries(GroupedMeasurements).map(
                      ([group, measure]) => (
                        <SelectGroup key={group}>
                          <SelectLabel>{t(`Group.${group}`)}</SelectLabel>
                          {Object.values(measure.enum).map((item) => {
                            return (
                              <SelectItem key={item} value={item}>
                                {t(`${group}.${item}`)}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      )
                    )}
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
