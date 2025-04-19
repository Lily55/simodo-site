import React from "react";
import styles from "./Header.module.css";
import { Logo } from "../Logo/Logo";
import { MenuItem } from "../MenuItem/MenuItem";
import { getTranslations } from "next-intl/server";

export const Header = async ({ locale }: { locale: string }) => {
  const t = await getTranslations();

  return (
    <div className={styles.mainContainer}>
      <Logo />
      <div className={styles.menuContainer}>
        <MenuItem href={`/${locale}/home`} title={t("home.about")} />
        <MenuItem href={`/${locale}/examples`} title={t("home.examples")} />
        <a href="http://simodo.ru" style={{ textDecoration: "none" }}>
          {t("home.distributions")}
        </a>
        <MenuItem href={`/${locale}/forum`} title={t("home.forum")} />
      </div>
    </div>
  );
};
