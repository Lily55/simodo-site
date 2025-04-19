"use client";
import Image from "next/image";
import React from "react";
import InfoBlock from "./InfoBlock";
import styles from "./home.module.css";

export const DesktopHomepage = () => {
  return (
    <div className={styles.mainContainer}>
      <Image
        src={"/darkened-background.jpeg"}
        alt=""
        fill
        className={styles.backgroundImage}
      />
      <InfoBlock />
    </div>
  );
};
