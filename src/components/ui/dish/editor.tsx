"use client";

import { Dish, Ingredient, Measurement, WithId } from "@/sdk/types";
import React, { Usable, use } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button, buttonVariants } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import IngredientsFinder from "./ingredients-finder";
import { useTranslations } from "next-intl";
import IngredientMeasure from "./ingredient-measure";
import { Textarea } from "../textarea";
import { Separator } from "@radix-ui/react-separator";
import { ImageOff, PlusIcon, Save } from "lucide-react";
import clsx from "clsx";
import ImageSearch from "../collection/imagesearch";
import { AspectRatio } from "../aspect-ratio";
import { useRouter } from "@/i18n/routing";
import { useEditor } from "@/hooks/use-editor";
import useFormPicture from "@/hooks/use-form-picture";
import { EditorProps } from "../props";
import SaveButton from "../collection/save-button";
import DeleteButton from "../collection/delete-button";
import EditorControls from "../collection/editor-controls";

const ingredientForm = z.object({
  measure: z.nativeEnum(Measurement),
  ingredient: z.string(),
  quantity: z.coerce.number(),
});

const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, {
    message: "Имя должно быть не менее 2 символов",
  }),
  description: z.string().optional(),
  picture: z.string().optional(),
  ingredients: z.array(ingredientForm),
});

export default function DishEditor({
  noSaveButton = false,
  noDeleteButton = false,
  redirect,
  entity,
  formId,
  readonly,
  ingredientsGetter,
  submitAction,
}: {
  ingredientsGetter: Usable<WithId<Ingredient>[]>;
} & EditorProps<Dish>) {
  const { id, form } = useEditor({
    formId,
    formSchema,
    defaultValues: {
      _id: entity?._id,
      name: entity?.name ?? "",
      description: entity?.description ?? "",
      picture: entity?.picture ?? "",
      ingredients: entity?.ingredients ?? [],
    },
  });
  const { picture, setPicture } = useFormPicture({
    initialValue: entity?.picture,
    form,
  });
  const t = useTranslations("DishEditor");
  const { replace } = useRouter();
  const ingredients = use(ingredientsGetter);
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await submitAction?.({
      _id: values._id,
      name: values.name,
      description: values.description ?? "",
      picture: values.picture,
      ingredients: values.ingredients,
    });
    if (redirect != null) {
      replace(redirect);
    }
  }
  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form
          id={id}
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-4`}
        >
          <div className="grid grid-cols-2 gap-8 divide-x justify-items-stretch">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
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
                name="description"
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
            <div className="flex justify-center items-center">
              <div className="max-w-72 w-full h-full flex items-center justify-center">
                {picture ? (
                  <AspectRatio>
                    <img
                      src={picture}
                      alt="Image here"
                      className="w-full h-full object-cover rounded-lg shadow-md border-2"
                    ></img>
                  </AspectRatio>
                ) : (
                  <div aria-details="Здесь будет ваша картинка">
                    <ImageOff size={64}></ImageOff>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
        <FormField
          control={form.control}
          name="_id"
          render={({ field }) => <Input type="hidden" {...field}></Input>}
        ></FormField>
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

        <FormItem className="flex flex-col flex-wrap gap-4">
          <FormLabel>Ингредиенты</FormLabel>
          <div className="flex gap-4 flex-wrap">
            {fields.map((field, index) => {
              const ingredient = ingredients.find(
                (it) => it._id === field.ingredient
              );
              return ingredient ? (
                <IngredientMeasure
                  readonly={readonly}
                  index={index}
                  control={form.control}
                  key={field.id}
                  ingredientDetails={ingredient}
                  remove={() => remove(index)}
                ></IngredientMeasure>
              ) : null;
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
                  <PopoverContent>
                    <IngredientsFinder
                      selectedIngredients={form
                        .getValues("ingredients")
                        .map((it) => it.ingredient)}
                      ingredients={ingredients}
                      selector={append}
                    ></IngredientsFinder>
                  </PopoverContent>
                </Popover>
              </FormControl>
            )}
          </div>
        </FormItem>
        <Separator
          orientation="horizontal"
          className="h-1 bg-muted"
        ></Separator>
        {readonly ? null : (
          <EditorControls
            formId={id}
            deleteHref={`/dishes/delete/${entity?._id}`}
            noSaveButton={noSaveButton}
            noDeleteButton={noDeleteButton}
          ></EditorControls>
        )}
      </Form>
    </div>
  );
}
