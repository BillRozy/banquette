import { ingredientDeleteAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import BottomDrawer from "@/app/ui/collection/drawer";

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
  return (
    <BottomDrawer header="Удалить ингредиент?">
      <Button
        variant="destructive"
        onClick={deleteIngredient}
        className="mx-auto flex"
      >
        Подтверждаю
      </Button>
    </BottomDrawer>
  );
}
