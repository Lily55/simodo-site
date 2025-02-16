import React from "react";
import styles from "./MenuItem.module.css";

interface Props {
  title: string;
}

export const MenuItem = ({ title }: Props) => {
  return <div className={styles.itemText}>{title}</div>;
};
