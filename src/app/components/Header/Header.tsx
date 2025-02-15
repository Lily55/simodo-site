import React from "react";
// import styles from "./Header.module.css";
import { Logo } from "../Logo/Logo";
import { MenuItem } from "../MenuItem/MenuItem";

export const Header = () => (
  <div>
    <Logo />
    <div>
      <MenuItem />
      <MenuItem />
    </div>
  </div>
);
