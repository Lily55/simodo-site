"use server";

import { cookies } from "next/headers";

export async function create(data: { name: string; value: string }) {
  const cookieStore = await cookies();

  cookieStore.set(`${data.name}`, `${data.value}`);
}
