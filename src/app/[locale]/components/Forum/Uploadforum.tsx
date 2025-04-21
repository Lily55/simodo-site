"use client";
import React, { useState } from "react";
import axios from "axios";
import style from "../../forum/page.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const url = "http://localhost:1337/api/simodo-forums";

const Uploadforum = ({ locale }: { locale: string }) => {
  const session = useSession();

  if (session.status === "unauthenticated") redirect(`/${locale}/login`);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const sendData = () => {
    axios.post(url, {
      data: {
        Title: name,
        Description: description,
      },
    });
  };

  return (
    <div className={style.uploadpage}>
      <div className={style.topcont}>
        <h1>Задать вопрос</h1>
        <Link href={`/${locale}/forum`}>
          <button>Форум</button>
        </Link>
      </div>
      <div className={style.formcont}>
        <form className={style.uploadform}>
          <input
            type="text"
            placeholder="Введите заголовок"
            maxLength={74}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Введите описание вопроса"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              sendData();
              redirect(`/${locale}/forum`);
            }}
          >
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  );
};
export default Uploadforum;
