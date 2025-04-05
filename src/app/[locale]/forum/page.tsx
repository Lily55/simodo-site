import React from "react";

import { setRequestLocale } from "next-intl/server";
import Displayforum from "../components/Forum/Displayforum";
import styles from "./page.module.css";

const Forum = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  const locale = param.locale;
  setRequestLocale(locale);
  return (
    <div className={styles.container}>
      <Displayforum locale={locale} />
    </div>
  );
};

export default Forum;
