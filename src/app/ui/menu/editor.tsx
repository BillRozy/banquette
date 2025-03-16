"use client";

import { Dish, DishInMenu, ID, Menu, MenuSection, WithId } from "@/sdk/types";
import React, { useCallback, useEffect, useState } from "react";

import { useFieldArray } from "react-hook-form";
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
import { useTranslations } from "next-intl";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import { useEditor } from "@/hooks/use-editor";
import { EditorProps } from "../../../components/ui/props";
import EditorControls from "../collection/editor-controls";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { ChevronDown, PlusIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import DishesFinder from "./dishes-finder";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import { getCreateSchema, getEditSchema } from "@/app/actions/editor-schema";
import { MenuSchema, MenuSectionEnumSchema } from "@/sdk/schemas";
import { createAction, editAction } from "@/app/actions/menu";

function MenuSectionView({
  sectionName,
  dishes,
  append,
  selectedDishes,
  readonly = false,
}: {
  sectionName: MenuSection;
  dishes: WithId<Dish>[];
  append: (dish: DishInMenu) => void;
  selectedDishes: DishInMenu[];
  readonly?: boolean;
}) {
  const t = useTranslations("MenuEditor.Section");
  const [sectionDishes, setSectionDishes] = useState<Dish[]>([]);
  const calcSectionDishes = useCallback(() => {
    const appFields: DishInMenu[] = selectedDishes.filter(
      (it: DishInMenu) => it.section === sectionName
    );
    setSectionDishes(
      dishes.filter((it) => appFields.some((field) => field.id === it._id))
    );
  }, [dishes, selectedDishes]);
  const addDishToMenuSection = useCallback(
    (id: ID) => {
      append({
        id,
        portions: 0,
        section: sectionName,
      });
    },
    [dishes]
  );
  useEffect(() => {
    calcSectionDishes();
  }, [dishes, selectedDishes]);
  return (
    <FormItem className="flex flex-col items-start gap-6">
      <FormLabel className="uppercase text-xl font-semibold tracking-[0.2em] flex items-center">
        {t(sectionName)}
        {!readonly && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <PlusIcon></PlusIcon>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <DishesFinder
                selectedDishes={selectedDishes.map((it: DishInMenu) => it.id)}
                dishes={dishes}
                selector={addDishToMenuSection}
              ></DishesFinder>
            </PopoverContent>
          </Popover>
        )}
      </FormLabel>
      <ul className="space-y-2">
        {sectionDishes.map((it) => (
          <div className="flex flex-col" key={it.name}>
            <div className="text-md font-semibold">{it.name}</div>
            <p className="text-sm text-muted-foreground">{it.description}</p>
            <Collapsible className="text-xs text-muted-foreground">
              <CollapsibleTrigger className="flex items-center">
                {t("ingredients")}
                <ChevronDown size={12}></ChevronDown>
              </CollapsibleTrigger>
              <CollapsibleContent className="break-words">
                {it.ingredients.map((it) => it.ingredient).join(", ")}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </ul>
    </FormItem>
  );
}

export default function MenuEditor({
  formId,
  entityId,
  readonly = false,
  redirect,
  noSaveButton = false,
  entity,
  dishes,
}: EditorProps<Menu> & { dishes: WithId<Dish>[] }) {
  const { id, form, handleSubmitWithAction, action } = useEditor({
    redirect,
    formId,
    formSchema:
      entityId != null
        ? getEditSchema(MenuSchema)
        : getCreateSchema(MenuSchema),
    formAction: entityId != null ? editAction : createAction,
    props: {
      formProps: {
        defaultValues: {
          id: entityId,
          entity: entity ?? {
            name: "",
            description: "",
            dishes: [],
            participants: [],
          },
          picture: "",
        },
      },
    },
  });
  const t = useTranslations("MenuEditor");
  const { append, fields } = useFieldArray({
    name: "entity.dishes",
    control: form.control,
  });
  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form id={id} onSubmit={handleSubmitWithAction} className="space-y-4">
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
                    Название меню, например: День рождения 2025
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
          </div>
          <Separator
            orientation="horizontal"
            className="h-1 bg-muted"
          ></Separator>
          <div className="p-8 shadow-md bg-neutral-50 relative">
            <div className="absolute top-2 p-4 left-4 text-5xl bg-neutral-50 tracking-[0.4em] text-neutral-300">
              {t("menu")}
            </div>
            <FormField
              name="entity.dishes"
              control={form.control}
              render={({ field }) => {
                return (
                  <div className="border-2 p-8 pt-16 space-y-8">
                    <div className="flex flex-col lg:grid grid-cols-2 gap-8 justify-items-stretch">
                      {/* column 1 */}
                      <div className="space-y-8">
                        {[
                          MenuSectionEnumSchema.enum.appetizers,
                          MenuSectionEnumSchema.enum.desserts,
                        ].map((it) => (
                          <MenuSectionView
                            readonly={readonly}
                            key={it}
                            sectionName={it}
                            dishes={dishes}
                            selectedDishes={field.value}
                            append={append}
                          ></MenuSectionView>
                        ))}
                      </div>
                      {/* column 2 */}
                      <div className="space-y-8">
                        {[
                          MenuSectionEnumSchema.enum.mainCourses,
                          MenuSectionEnumSchema.enum.others,
                        ].map((it) => (
                          <MenuSectionView
                            readonly={readonly}
                            key={it}
                            sectionName={it}
                            dishes={dishes}
                            selectedDishes={field.value}
                            append={append}
                          ></MenuSectionView>
                        ))}
                      </div>
                    </div>
                    <div>
                      <MenuSectionView
                        readonly={readonly}
                        sectionName={MenuSectionEnumSchema.enum.drinks}
                        dishes={dishes}
                        selectedDishes={field.value}
                        append={append}
                      ></MenuSectionView>
                    </div>
                  </div>
                );
              }}
            ></FormField>
          </div>
        </form>
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
