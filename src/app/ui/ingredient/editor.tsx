"use client";

import { Ingredient } from "@/sdk/types";
import React from "react";

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
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import ImageSearch from "../collection/imagesearch";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import { ImageOff } from "lucide-react";
import useFormPicture from "@/hooks/use-form-picture";
import EditorControls from "../collection/editor-controls";
import { CldImage } from "next-cloudinary";
import { MultiSelect } from "@/components/ui/multi-select";
import { useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { IngredientCategoryEnumSchema, IngredientSchema } from "@/sdk/schemas";
import { createAction, editAction } from "@/app/actions/ingredient";
import { getCreateSchema, getEditSchema } from "@/app/actions/editor-schema";
import { useEditor } from "@/hooks/use-editor";
import { EditorProps } from "@/components/ui/props";

export default function IngredientEditor({
  formId,
  entityId,
  readonly = false,
  redirect,
  noSaveButton = false,
  entity,
}: EditorProps<Ingredient>) {
  const t = useTranslations("Ingredient.Category");
  const categoryOptions = Object.values(IngredientCategoryEnumSchema.enum).map(
    (category) => ({
      value: category,
      label: t(category),
    })
  );
  const { id, form, handleSubmitWithAction, action } = useEditor({
    redirect,
    formId,
    formSchema:
      entityId != null
        ? getEditSchema(IngredientSchema)
        : getCreateSchema(IngredientSchema),
    formAction: entityId != null ? editAction : createAction,
    props: {
      formProps: {
        defaultValues: {
          id: entityId,
          entity: entity ?? {
            name: "",
            description: "",
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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(200px,1fr)_3fr] gap-8 items-start">
        <div className="flex justify-center items-center p-2">
          <div className="max-w-72 w-full h-full flex justify-center items-center rounded-lg border-[1px] border-gray-300 overflow-hidden">
            {picture ? (
              <AspectRatio>
                <img
                  src={picture}
                  alt="Image here"
                  className="w-full h-full object-cover "
                ></img>
              </AspectRatio>
            ) : entityId != null ? (
              <CldImage
                alt={`picture of the ingredient with id == ${entityId}`}
                src={`ingredient-${entityId}`}
                width="128"
                height="128"
                defaultImage="ingredient-default.png"
                className="w-full h-full object-cover"
                crop={{
                  type: "auto",
                  source: true,
                }}
              />
            ) : (
              <div aria-details="Здесь будет ваша картинка">
                <ImageOff size={64}></ImageOff>
              </div>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            id={id}
            onSubmit={handleSubmitWithAction}
            className={`space-y-4 items-center`}
          >
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
                  {!readonly && (
                    <FormDescription>
                      Имя ингредиента, например: Помидор
                    </FormDescription>
                  )}
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
                      className="resize-none"
                      rows={3}
                      disabled={readonly}
                      placeholder="Описание"
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
                    <FormLabel>Ссылка на картинку продукта</FormLabel>
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
          </form>
        </Form>
      </div>
      <Separator
        orientation="horizontal"
        className="h-0.5 bg-gray-100"
      ></Separator>
      {!readonly && (
        <div className="mt-2 w-full">
          <ImageSearch
            initialQuery={form.getValues("entity.name")}
            selectedImage={picture}
            select={setPicture}
          ></ImageSearch>
        </div>
      )}
      {!readonly && (
        <>
          <Separator
            orientation="horizontal"
            className="h-0.5 bg-gray-100"
          ></Separator>
          <EditorControls
            actionPending={action.isPending}
            formId={id}
            noSaveButton={noSaveButton}
          ></EditorControls>
        </>
      )}
    </div>
  );
}
