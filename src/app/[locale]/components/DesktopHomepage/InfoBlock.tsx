"use client";

import { useTranslations } from "next-intl";
import React from "react";
import styles from "./home.module.css";

const InfoBlock = () => {
  const t = useTranslations();
  return (
    <div className={styles.infoblock}>
      <div className={styles.commonParagraph}>
        <div className={styles.paragraphOne}>
          <h1 className={styles.longName}>{t("home.longName")}</h1>{" "}
          {t("home.paragraphOne")}{" "}
          <h1 className={styles.longName}>{t("home.shortName")}</h1>
        </div>
        <div className={styles.paragraphTwo}>
          <h1 className={styles.longName}>{t("home.mainAimTitle")}</h1>{" "}
          {t("home.mainAimDescription")}
        </div>
      </div>
      <div>
        <h1 className={styles.longName}>Краткое описание:</h1>
      </div>
      <div className={styles.paragraphThree}>
        <h1 className={styles.longName}>Адаптивная система моделирования</h1> —
        новое понятие в имитационном математическом моделировании, когда в
        основе системы лежит набор предметно-ориентированных языков (ПОЯ).
        Каждый из таких языков отвечает только за свою предметную область,
        которую он описывает наиболее полно и в то же время просто.
      </div>
      <div className={styles.paragraphThree}>
        <h1 className={styles.longName}>Адаптивная система моделирования</h1>{" "}
        подразумевает предоставление технологии построения ПОЯ. Кроме того
        предполагается, что система должна иметь открытую программную
        архитектуру, позволяющую добавлять в неё без перекомпиляции
        семантические модули новых языков, плагины визуализации и
        редактирования, модули для использования из языков и другие расширения.
      </div>
    </div>
  );
};

export default InfoBlock;
