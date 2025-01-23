import { API } from "@/sdk";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const ingredient = await API.getIngredient((await params).id);
  return new Response(JSON.stringify(ingredient), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
