"use client";
import React, { type FormEventHandler, useState } from "react";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log(formData);

    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (res && !res.error) {
      router.push("/ru/forum");
    } else {
      console.log(res);
    }
  };

  // const sendData = async () => {
  //   try {
  //     const response = await fetch(authUrl, {
  //       method: "POST",

  //       body: JSON.stringify({
  //         login: login,
  //         password: password,
  //       }),

  //       headers: {
  //         "content-type": "application/json",
  //         credentials: "include",
  //       },
  //     });

  //     const responseJSON = await response.json();

  //     if (!responseJSON.code) {
  //       localStorage.setItem("access", responseJSON.access);
  //       localStorage.setItem("refresh", responseJSON.refresh);
  //       redirect(`ru/upload`);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const sendToken = async () => {
  //   try {
  //     const accessToken = localStorage.getItem("access");
  //     const response = await fetch(`${verifyUrl}?access=${accessToken}`);

  //     const responseJSON = await response.json();

  //     console.log(responseJSON);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <div className={styles.formContainer}>
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Введите свою почту"
          maxLength={74}
          value={login}
          name="email"
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          placeholder="Введите свой пароль"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.formButton} type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
