import { setRequestLocale } from "next-intl/server";
import React from "react";
import { ExamplesContent } from "./ExamplesContent";

// Импортируем CSS-модуль для стилизации
import styles from './page.module.css';

export default function Examples({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  
  return (
    <div className={styles.examplesContainer}>
      <ExamplesContent />
    </div>
  );
}
