"use client";

import { Ingredient } from "@/sdk/types";
import React from "react";

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
import { AspectRatio } from "../aspect-ratio";
import ImageSearch from "../collection/imagesearch";
import { Textarea } from "../textarea";
import { Separator } from "@radix-ui/react-separator";
import { ImageOff } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useEditor } from "@/hooks/use-editor";
import useFormPicture from "@/hooks/use-form-picture";
import { EditorProps } from "../props";
import EditorControls from "../collection/editor-controls";

const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, {
    message: "Имя должно быть не менее 2 символов",
  }),
  description: z.string().optional(),
  picture: z.string().optional(),
});

export default function IngredientEditor({
  redirect,
  formId,
  entity,
  readonly,
  noSaveButton = false,
  noDeleteButton = false,
  submitAction,
}: EditorProps<Ingredient>) {
  const { id, form } = useEditor({
    formId,
    formSchema,
    defaultValues: {
      _id: entity?._id,
      name: entity?.name ?? "",
      description: entity?.description ?? "",
      picture: entity?.picture ?? "",
    },
  });
  const { picture, setPicture } = useFormPicture({
    initialValue: entity?.picture,
    form,
  });
  const { replace } = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await submitAction?.({
      _id: values._id,
      name: values.name,
      description: values.description ?? "",
      picture: values.picture,
    });
    if (redirect != null) {
      replace(redirect);
    }
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(200px,1fr)_3fr] gap-8">
        <div className="flex justify-center items-center">
          <div className="max-w-72 w-full h-full flex justify-center items-center">
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

        <Form {...form}>
          <form
            id={id}
            onSubmit={form.handleSubmit(onSubmit)}
            className={`space-y-4 items-center`}
          >
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
              name="description"
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

            <FormField
              control={form.control}
              name="_id"
              render={({ field }) => <Input type="hidden" {...field}></Input>}
            ></FormField>
          </form>
        </Form>
      </div>
      <Separator
        orientation="horizontal"
        className="h-0.5 bg-gray-100"
      ></Separator>
      {!readonly && (
        <div className="flex mt-2 justify-center">
          <ImageSearch
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
            formId={id}
            deleteHref={`/ingredients/delete/${entity?._id}`}
            noSaveButton={noSaveButton}
            noDeleteButton={noDeleteButton}
          ></EditorControls>
        </>
      )}
    </div>
  );
}
