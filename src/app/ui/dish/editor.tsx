"use client";

import { Dish, ID, Ingredient, MeasuredIngredient, WithId } from "@/sdk/types";
import React, { memo, Suspense, useCallback, useEffect, useState } from "react";

import { Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { buttonVariants } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import IngredientsFinder from "./ingredients-finder";
import { useTranslations } from "next-intl";
import IngredientMeasure from "./ingredient-measure";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import { ImageOff, PlusIcon } from "lucide-react";
import clsx from "clsx";
import ImageSearch from "../collection/imagesearch";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { useEditor } from "@/hooks/use-editor";
import useFormPicture from "@/hooks/use-form-picture";
import { EditorProps } from "../../../components/ui/props";
import EditorControls from "../collection/editor-controls";
import { getIngredientById } from "@/app/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
import { DishCategoryEnumSchema, DishSchema } from "@/sdk/schemas";
import { getCreateSchema, getEditSchema } from "@/app/actions/editor-schema";
import { createAction, editAction } from "@/app/actions/dish";
import DishImage from "./dish-image";

const MemoizedIngredientMeasure = memo(function MemoizedIngredientMeasure({
  readonly = false,
  index,
  control,
  ingredientId,
  removeFunction,
}: {
  readonly?: boolean;
  index: number;
  control: any;
  ingredientId: ID;
  removeFunction: (index: number) => void;
}) {
  const [dataPromise, setDataPromise] = useState<Promise<WithId<Ingredient>>>(
    null!
  );
  const remove = useCallback(() => {
    removeFunction(index);
  }, [removeFunction, index]);

  const getData = useCallback(() => {
    return getIngredientById(ingredientId);
  }, [ingredientId]);

  useEffect(() => {
    setDataPromise(getData());
  }, [getData]);

  if (!dataPromise) {
    return null;
  }

  return (
    <Suspense
      fallback={<Skeleton className="w-60 h-[120px] rounded-sm"></Skeleton>}
    >
      <IngredientMeasure
        readonly={readonly}
        index={index}
        control={control}
        ingredientUsable={dataPromise}
        remove={remove}
      ></IngredientMeasure>
    </Suspense>
  );
});

export default function DishEditor({
  formId,
  entityId,
  readonly = false,
  redirect,
  noSaveButton = false,
  entity,
}: EditorProps<Dish>) {
  const tc = useTranslations("Dish.Category");
  const categoryOptions = Object.values(DishCategoryEnumSchema.enum).map(
    (category) => ({
      value: category,
      label: tc(category),
    })
  );
  const { id, form, handleSubmitWithAction, action } = useEditor({
    redirect,
    formId,
    formSchema:
      entityId != null
        ? getEditSchema(DishSchema)
        : getCreateSchema(DishSchema),
    formAction: entityId != null ? editAction : createAction,
    props: {
      formProps: {
        defaultValues: {
          id: entityId,
          entity: entity ?? {
            name: "",
            description: "",
            ingredients: [],
            category: [],
          },
          picture: "",
        },
      },
    },
  });
  const { replace: replaceArray } = useFieldArray({
    control: form.control,
    name: "entity.category",
  });
  const { picture, setPicture } = useFormPicture({
    initialValue: "",
    form,
  });
  const { append, remove, fields } = useFieldArray({
    name: "entity.ingredients",
    control: form.control,
  });
  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form id={id} onSubmit={handleSubmitWithAction} className={`space-y-4`}>
          <div className="grid grid-cols-2 gap-8 divide-x justify-items-stretch">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="entity.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Наименование*</FormLabel>
                    <FormControl>
                      <Input
                        disabled={readonly}
                        placeholder="Наименование"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Имя блюда, например: Оливье
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entity.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={readonly}
                        rows={3}
                        placeholder="Описание"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entity.category"
                render={() => (
                  <FormItem>
                    <FormLabel>Категории</FormLabel>
                    <FormControl>
                      <MultiSelect
                        disabled={readonly}
                        defaultValue={form.getValues("entity.category")}
                        onValueChange={replaceArray}
                        variant="inverted"
                        options={categoryOptions}
                        maxCount={5}
                      ></MultiSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {!readonly && (
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на картинку блюда</FormLabel>
                      <FormControl>
                        <Input
                          disabled={readonly}
                          placeholder="Картинка"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex justify-center items-center p-2">
              <div className="max-w-72 w-full h-full flex justify-center items-center">
                <AspectRatio
                  ratio={1 / 1}
                  className="rounded-lg border-[1px] border-gray-300 overflow-hidden flex justify-center"
                >
                  {picture ? (
                    <img
                      src={picture}
                      alt="Image here"
                      className="w-full h-full object-cover"
                    ></img>
                  ) : entityId != null ? (
                    <DishImage id={entityId}></DishImage>
                  ) : (
                    <div
                      aria-details="Здесь будет ваша картинка"
                      className="flex items-center"
                    >
                      <ImageOff size={64}></ImageOff>
                    </div>
                  )}
                </AspectRatio>
              </div>
            </div>
          </div>
        </form>
        <Separator
          orientation="horizontal"
          className="h-1 bg-muted"
        ></Separator>
        {!readonly && (
          <>
            <ImageSearch select={setPicture}></ImageSearch>
            <Separator
              orientation="horizontal"
              className="h-1 bg-muted"
            ></Separator>
          </>
        )}
        <FormField
          control={form.control}
          name="entity.ingredients"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col flex-wrap gap-4">
                <FormLabel>Ингредиенты</FormLabel>
                <FormControl>
                  <div className="flex gap-4 flex-wrap">
                    {fields.map((item, index) => {
                      return (
                        <Controller
                          name={`entity.ingredients.${index}`}
                          key={item.id}
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <MemoizedIngredientMeasure
                                index={index}
                                ingredientId={field.value.ingredient}
                                removeFunction={remove}
                                control={form.control}
                                readonly={readonly}
                              ></MemoizedIngredientMeasure>
                            );
                          }}
                        ></Controller>
                      );
                    })}
                    {!readonly && (
                      <FormControl>
                        <Popover>
                          <PopoverTrigger
                            title="Add Ingredient"
                            className={clsx(
                              "w-[119px] h-[119px] rounded-xl",
                              buttonVariants({ variant: "outline" })
                            )}
                          >
                            <PlusIcon></PlusIcon>
                          </PopoverTrigger>
                          <PopoverContent className="max-w-lg w-12/12">
                            <IngredientsFinder
                              selectedIngredients={field.value.map(
                                (it: MeasuredIngredient) => it.ingredient
                              )}
                              selector={append}
                            ></IngredientsFinder>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <Separator
          orientation="horizontal"
          className="h-1 bg-muted"
        ></Separator>
        {readonly ? null : (
          <EditorControls
            actionPending={action.isPending}
            formId={id}
            noSaveButton={noSaveButton}
          ></EditorControls>
        )}
      </Form>
    </div>
  );
}
