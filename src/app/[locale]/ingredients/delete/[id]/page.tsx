import { ingredientDeleteAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function deleteIngredient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  async function deleteIngredient() {
    "use server";
    return ingredientDeleteAction(id);
  }
  return <Button onClick={deleteIngredient}>Точно Удалить</Button>;
}
