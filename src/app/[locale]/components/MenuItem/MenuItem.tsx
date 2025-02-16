import React from "react";
import styles from "./MenuItem.module.css";
import Link from "next/link";

interface Props {
  title: string;
  href: string;
}

export const MenuItem = ({ title, href }: Props) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className={styles.itemText}>{title}</div>
    </Link>
  );
};
