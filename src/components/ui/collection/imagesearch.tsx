import React, { useCallback } from "react";
import { Form, FormControl, FormField, FormItem } from "../form";
import { useForm, useFormState } from "react-hook-form";
import { Input } from "../input";
import { searchPicturesByDescription } from "@/app/actions";
import { Button } from "../button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  searchBy: z.string().min(2, {
    message: "Должно быть не менее 2 символов",
  }),
});

export default function ImageSearch({
  selectedImage,
  select,
}: {
  selectedImage?: string;
  select: (image: string) => void;
}) {
  const [selectedImageCache, setSelectedImageCache] = React.useState<
    string | undefined
  >(selectedImage);
  const [images, setImages] = React.useState<string[]>([]);
  const locale = useLocale();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchBy: "",
    },
  });
  const { isSubmitting } = useFormState(form);
  const submit = async (values: z.infer<typeof formSchema>) => {
    setImages(await searchPicturesByDescription(values.searchBy, locale));
  };
  const selectImage = useCallback(
    (image: string) => {
      setSelectedImageCache(image);
      select(image);
    },
    [select]
  );
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <FormField
            name="searchBy"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      placeholder="Описание картинки"
                      type="text"
                      {...field}
                    ></Input>
                    <Button type="submit" size="sm" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Загрузка предложенных вариантов...
                        </>
                      ) : (
                        "Получить варианты картинок"
                      )}
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </form>
      </Form>
      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt={"result"}
            className={clsx(
              "rounded-md size-16 cursor-pointer bg-muted ring-gray-800 hover:ring-4",
              image === selectedImageCache && "ring-2"
            )}
            onClick={() => selectImage(image)}
          ></img>
        ))}
      </div>
    </div>
  );
}
