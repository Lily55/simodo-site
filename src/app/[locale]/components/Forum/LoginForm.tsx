"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { redirect } from "next/navigation";

const authUrl = "http://localhost:29901/api/v1/auth/sign-in";
const verifyUrl = "http://localhost:29901/api/v1/auth/verify";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const sendData = async () => {
    try {
      const response = await fetch(authUrl, {
        method: "POST",

        body: JSON.stringify({
          login: login,
          password: password,
        }),

        headers: {
          "content-type": "application/json",
          credentials: "include",
        },
      });

      const responseJSON = await response.json();

      if (!responseJSON.code) {
        localStorage.setItem("access", responseJSON.access);
        localStorage.setItem("refresh", responseJSON.refresh);
        redirect(`ru/upload`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendToken = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`${verifyUrl}?access=${accessToken}`);

      const responseJSON = await response.json();

      console.log(responseJSON);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputForm}>
        <input
          type="text"
          placeholder="Enter your login"
          maxLength={74}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.formButton} onClick={sendData}>
          Войти
        </button>
        <button className={styles.formButton} onClick={sendToken}>
          Войти
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
