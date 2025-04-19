"use client";
import React, { useEffect, useState } from "react";
import style from "../../forum/page.module.css";
import { readForum } from "app/api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
// import { redirect } from "next/navigation";
import Post from "./Post";
import Link from "next/link";

export type postAnswer = {
  answerAuthor?: string;
  answerText: string;
};

export type PostType = {
  id: number;
  Title: string;
  Description: string;
  Username: string;
  Answers: postAnswer[];
};

const Displayforum = ({
  locale,
}: {
  cookies?: ReadonlyRequestCookies;
  locale: string;
}) => {
  const [data, setData] = useState<PostType[]>([]);

  useEffect(() => {
    const getResponse = async () => {
      try {
        const response = await readForum();
        setData(response.data.data.reverse());
        //console.log(data);
      } catch (e) {
        console.log(e);
      }
    };

    getResponse();
  }, []);

  // const handleRedirect = () => {
  //   redirect(`/${locale}/login`);
  // };

  return (
    <div>
      <div className={style.topcont}>
        <h1 className={style.heading}>Форум</h1>
        <div>
          <Link href={`/${locale}/upload`}>
            <button>Задать вопрос</button>
          </Link>
          <button>Login</button>
        </div>
      </div>
      <h2 className={style.subheading}>Вопросы</h2>
      {data?.map((post, i) => (
        <Post {...post} key={i} />
      ))}
    </div>
  );
};
export default Displayforum;
