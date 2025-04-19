"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
// import axios from "axios";

const registrationUrl = "http://localhost:29901/api/v1/auth/sign-up";
// const cmsRegistr = "http://localhost:1337/api/simodo-users";

const RegistrationForm = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sendData = async () => {
    try {
      const response = await fetch(registrationUrl, {
        method: "POST",
        body: JSON.stringify({
          userInfo: {
            login: login,
            email: email,
            password: password,
          },
        }),
        headers: {
          "content-type": "application/json",
          credentials: "include",
        },
      });

      if (response.status === 200) {
        alert("Вы зарегестрированы");
      }

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputForm}>
        <input
          type="text"
          placeholder="Введите логин"
          maxLength={74}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Введите почту"
          maxLength={74}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.formButton} onClick={sendData}>
          Зарегестрироваться
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
