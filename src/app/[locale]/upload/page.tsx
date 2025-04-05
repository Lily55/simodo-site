import React from "react";

import { setRequestLocale } from "next-intl/server";
import Uploadforum from "../components/Forum/Uploadforum";
const Upload = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  const locale = param.locale;
  setRequestLocale(locale);
  return (
    <div>
      <Uploadforum locale={locale} />
    </div>
  );
};
export default Upload;
