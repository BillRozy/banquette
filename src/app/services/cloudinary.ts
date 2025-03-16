import { EntityEnum, ID } from "@/sdk/types";
import { v2 as cloudinary } from "cloudinary";

const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!API_KEY) {
  throw new Error(
    'Invalid/Missing environment variable: "NEXT_PUBLIC_CLOUDINARY_API_KEY"'
  );
}

if (!API_SECRET) {
  throw new Error(
    'Invalid/Missing environment variable: "CLOUDINARY_API_SECRET"'
  );
}

if (!CLOUD_NAME) {
  throw new Error(
    'Invalid/Missing environment variable: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"'
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const ENTITY_TO_FOLDER: Record<EntityEnum, string> = {
  Ingredient: "/festive/ingredients",
  Dish: "/festive/dishes",
  Menu: "/festive/menus",
};

export const uploadEntityImage = async (
  entityName: EntityEnum,
  id: ID,
  picture: string
) => {
  return cloudinary.uploader.upload(picture, {
    resource_type: "image",
    public_id: `${entityName.toLocaleLowerCase()}-${id}`,
    overwrite: true,
    asset_folder: ENTITY_TO_FOLDER[entityName],
    invalidate: true,
  });
};
