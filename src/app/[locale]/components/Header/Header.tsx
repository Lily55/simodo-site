"use client";

import React from "react";
import styles from "./Header.module.css";
import { Logo } from "../Logo/Logo";
import { MenuItem } from "../MenuItem/MenuItem";
import { useTranslations } from "next-intl";

export const Header = () => {
  const t = useTranslations();

  return (
    <div className={styles.mainContainer}>
      <Logo />
      <div className={styles.menuContainer}>
        <MenuItem title={t("home.about")} />
        <MenuItem title={t("home.examples")} />
      </div>
    </div>
  );
};
