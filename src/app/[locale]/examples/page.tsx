import { setRequestLocale } from "next-intl/server";
import React from "react";
import { ExamplesContent } from "./ExamplesContent";

// Импортируем CSS-модуль для стилизации
import styles from "./page.module.css";

const Examples = async ({ params }: { params: { locale: string } }) => {
  const param = await params;
  setRequestLocale(param.locale);

  return (
    <div className={styles.examplesContainer}>
      <ExamplesContent />
    </div>
  );
};

export default Examples;
