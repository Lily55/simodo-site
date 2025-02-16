import { setRequestLocale } from "next-intl/server";
import React from "react";
import { DesktopHomepage } from "../components/DesktopHomepage/DesktopHomepage";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <div>
      <DesktopHomepage />
    </div>
  );
}
