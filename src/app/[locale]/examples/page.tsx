import { setRequestLocale } from "next-intl/server";
import React from "react";

export default function Examples({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <div></div>;
}
