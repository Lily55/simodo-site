"use client";
import React, { useState } from "react";
import style from "../../forum/page.module.css";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

const LoginAndRegistration = ({ locale }: { locale: string }) => {
  const [loginOrRegistration, setLoginOrRegestration] =
    useState<string>("login");

  return (
    <div>
      <div className={style.uploadpage}>
        <div className={style.topcont}>
          <h1>Вход/Регистрация</h1>
          <Link href={`/${locale}/forum`}>
            <button>Форум</button>
          </Link>
        </div>
        <div className={styles.tabs}>
          <div
            onClick={() => setLoginOrRegestration("login")}
            className={styles.tab}
          >
            Вход
          </div>
          <div
            onClick={() => setLoginOrRegestration("registration")}
            className={styles.tab}
          >
            Регистрация
          </div>
        </div>
        {loginOrRegistration === "login" ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};

export default LoginAndRegistration;
