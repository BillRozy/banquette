"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../../components/ui/form";
import { Checkbox } from "../../../../components/ui/checkbox";
import { use, useEffect } from "react";
import { useTranslations } from "next-intl";
import { badgeVariants } from "../../../../components/ui/badge";
import { cn } from "@/lib/utils";
import { EntityFilterContext } from "./provider";

const FormSchema = z.object({
  categories: z.array(z.string()),
});

export default function CategoryFilter() {
  const t2 = useTranslations("EntityCategoryFilter");
  const {
    pagination: { resetPagination },
    entityFilters: { categories, setCategories },
    categoriesWithCounts,
    entityName,
  } = use<EntityFilterContext>(EntityFilterContext);
  const t = useTranslations(`${entityName}.Category`);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: categories ?? [],
    },
  });
  useEffect(() => {
    const { unsubscribe } = form.watch((value) => {
      resetPagination();
      if (value.categories == null) {
        setCategories(null);
      } else {
        setCategories(value.categories?.length > 0 ? value.categories : null);
      }
    });
    return () => unsubscribe();
  }, [form.watch]);
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm">{t2("title")}</FormLabel>
              <div className="flex flex-wrap justify-start items-center gap-2">
                {categoriesWithCounts?.map(([category, count]) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category}
                          className="flex flex-row items-center space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="hidden"
                              checked={field.value?.includes(category)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              badgeVariants({
                                variant: field.value?.includes(category)
                                  ? "default"
                                  : "outline",
                              }),
                              "cursor-pointer"
                            )}
                          >
                            {t(category)}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
