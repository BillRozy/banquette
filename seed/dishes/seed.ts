import dotenvFlow from "dotenv-flow";
dotenvFlow.config({
  default_node_env: "local",
});
import client from "@/app/services/mongo";
import { readdir, readFile } from "fs/promises";
import { DB_NAME, StorageCollections } from "@/sdk/api";
import { objectivateId } from "@/app/mongo_api";
import { Dish, WithId } from "@/sdk/types";
import { exit } from "process";

async function main() {
  await client.db(DB_NAME).collection(StorageCollections.DISHES).deleteMany();
  for (const file of await readdir(__dirname, {
    withFileTypes: true,
  })) {
    if (file.isFile() && file.name.endsWith(".json")) {
      const data = await readFile(`${file.parentPath}/${file.name}`, {
        encoding: "utf-8",
      });
      await client
        .db(DB_NAME)
        .collection(StorageCollections.DISHES)
        .bulkWrite(
          JSON.parse(data).map((dish: WithId<Dish>) => ({
            insertOne: {
              document: objectivateId(dish),
            },
          }))
        );
    }
  }
}

main()
  .then(() => {
    console.log("Dishes seeded.");
    exit(0);
  })
  .catch((e) => {
    console.error(e);
  });
