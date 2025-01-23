import { API } from "@/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  const ingredients = await API.getIngredients();
  return new Response(JSON.stringify(ingredients), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  const formData = await request.json();
  const id = await API.createIngredient(formData);
  return new Response(id, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
