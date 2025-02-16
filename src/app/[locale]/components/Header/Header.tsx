"use client";

import React from "react";
import styles from "./Header.module.css";
import { Logo } from "../Logo/Logo";
import { MenuItem } from "../MenuItem/MenuItem";
import { useTranslations } from "next-intl";

export const Header = ({ locale }: { locale: string }) => {
  const t = useTranslations();

  return (
    <div className={styles.mainContainer}>
      <Logo />
      <div className={styles.menuContainer}>
        <MenuItem href={`/${locale}/home`} title={t("home.about")} />
        <MenuItem href={`/${locale}/examples`} title={t("home.examples")} />
        <MenuItem
          href={`/${locale}/distributions`}
          title={t("home.distributions")}
        />
        <MenuItem href={`/${locale}/forum`} title={t("home.forum")} />
      </div>
    </div>
  );
};
