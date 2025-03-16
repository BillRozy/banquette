import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import { readdir, readFile } from "fs/promises";
import { Ingredient, WithId } from "@/sdk/types";
import { exit } from "process";
import client from "@/app/services/mongo";
import { DB_NAME, StorageCollections } from "@/sdk/api";
import { objectivateId } from "@/app/mongo_api";

async function main() {
  await client
    .db(DB_NAME)
    .collection(StorageCollections.INGREDIENTS)
    .deleteMany();
  for (const file of await readdir(__dirname, {
    withFileTypes: true,
  })) {
    if (file.isFile() && file.name.endsWith(".json")) {
      const data = await readFile(`${file.parentPath}/${file.name}`, {
        encoding: "utf-8",
      });
      await client
        .db(DB_NAME)
        .collection(StorageCollections.INGREDIENTS)
        .bulkWrite(
          JSON.parse(data).map((ingredient: WithId<Ingredient>) => ({
            insertOne: {
              document: objectivateId(ingredient),
            },
          }))
        );
    }
  }
}

main()
  .then(() => {
    console.log("Ingredients seeded.");
    exit(0);
  })
  .catch((e) => {
    console.error(e);
  });
