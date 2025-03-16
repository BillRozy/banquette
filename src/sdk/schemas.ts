import { z } from "zod";

export const IDSchema = z.string().brand("ID");
export const UserIDSchema = IDSchema.brand("UserID");

export const PrivateFilterEnumSchema = z.enum(["all", "private", "public"]);
export const EntityEnumSchema = z.enum(["Ingredient", "Dish", "Menu"]);
export const MassMeasurementEnumSchema = z.enum(["kg", "gramm"]);
export const VolumeMeasurementEnumSchema = z.enum(["liter", "milliliter"]);
export const OtherMeasurementEnumSchema = z.enum([
  "item",
  "teaspoon",
  "tablespoon",
]);
export const GroupedMeasurements = {
  Mass: MassMeasurementEnumSchema,
  Volume: VolumeMeasurementEnumSchema,
  Other: OtherMeasurementEnumSchema,
};
export const MeasurementEnumSchema = MassMeasurementEnumSchema.or(
  VolumeMeasurementEnumSchema
).or(OtherMeasurementEnumSchema);

export const EntitySchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .nonempty("Name should not be empty"),
  description: z
    .string({
      required_error: "Description is required",
    })
    .nonempty("Description should not be empty"),
  createdBy: UserIDSchema.optional(),
  updatedBy: UserIDSchema.optional(),
  private: z.boolean().default(false).optional(),
});

export const EntityFilterSchema = z.object({
  ids: z.array(z.string().brand("ID")).optional(),
  nameLike: z.string().optional(),
  createdBy: UserIDSchema.optional(),
  categories: z.array(z.string()).optional(),
  private: PrivateFilterEnumSchema.default(
    PrivateFilterEnumSchema.enum.all
  ).optional(),
});

export const PaginationFilterSchema = z.object({
  perPage: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
});

export const IngredientCategoryEnumSchema = z.enum([
  "vegetable",
  "fruit",
  "meat",
  "fish",
  "green",
  "dairy",
  "dryGoods",
  "bakery",
  "canned",
  "eggs",
  "spice",
  "oil",
  "vinegar",
  "sauce",
  "sweet",
  "drink",
  "sausage",
  "convenience",
  "other",
]);

export const IngredientSchema = EntitySchema.extend({
  category: z
    .array(IngredientCategoryEnumSchema)
    .min(1, "Please, select at least 1 category"),
});

export const MeasuredIngredientSchema = z.object({
  ingredient: IDSchema,
  measure: MeasurementEnumSchema,
  quantity: z.coerce.number().min(0, "Quantity should be >= 0"),
});

export const DishCategoryEnumSchema = z.enum([
  "appetizer",
  "mainCourse",
  "dessert",
  "salad",
  "soup",
  "sideDish",
  "beverage",
  "snack",
  "sauce",
  "bread",
  "breakfast",
  "brunch",
  "lunch",
  "dinner",
  "other",
]);

export const UserRoleEnumSchema = z.enum(["user", "admin", "moderator"]);

export const UserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  image: z.string().url().optional(),
  role: UserRoleEnumSchema,
});

export const DishSchema = EntitySchema.extend({
  ingredients: z.array(MeasuredIngredientSchema),
  category: z
    .array(DishCategoryEnumSchema)
    .min(1, "At least one category should be selected"),
});

export const MenuSectionEnumSchema = z.enum([
  "appetizers",
  "mainCourses",
  "desserts",
  "drinks",
  "others",
]);

export const DishInMenuSchema = z.object({
  id: z.string().nonempty().brand("ID"),
  portions: z.number().min(0, "There should be 0 or more portions"),
  section: MenuSectionEnumSchema,
});

export const MenuSchema = EntitySchema.merge(
  z.object({
    dishes: z.array(DishInMenuSchema),
    participants: z.array(UserIDSchema),
  })
);
