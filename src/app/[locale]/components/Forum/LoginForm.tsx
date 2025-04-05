"use client";
import React, { useState } from "react";
import style from "../../forum/page.module.css";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { create } from "./actions";

const authUrl = "http://localhost:29901/api/v1/auth/sign-in";

const LoginForm = ({ locale }: { locale: string }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const sendData = async () => {
    try {
      const response = await fetch(authUrl, {
        method: "POST",

        body: JSON.stringify({
          login: name,
          password: password,
        }),

        headers: {
          "content-type": "application/json",
          credentials: "include",
        },
      });

      if (!response.code) {
        create({ name: response.refresh, value: response.access });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={style.uploadpage}>
      <div className={style.topcont}>
        <h1>Вход/Регистрация</h1>
        <Link href={`/${locale}/forum`}>
          <button>Форум</button>
        </Link>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.inputForm}>
          <input
            type="text"
            placeholder="Enter your login"
            maxLength={74}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.formButton} onClick={sendData}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
