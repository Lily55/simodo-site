"use client";
import React, { useEffect, useState } from "react";
import style from "../../forum/page.module.css";
import Link from "next/link";
import { readForum } from "app/api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { create } from "./actions";
import { redirect } from "next/navigation";

type Article = {
  Answername: string;
  Answers: string[];
  Questions: string;
  Title: string;
  Username: string;
  id: number;
};

const Displayforum = ({
  locale,
}: {
  cookies?: ReadonlyRequestCookies;
  locale: string;
}) => {
  //   const [question, setQuestions] = useState({});

  const [data, setData] = useState<Article[]>([]);
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
    create({ name: "auth-token", value: "fhjksjfklsjfjlksdklfkkfk" });

    getResponse();
  }, []);

  const handleRedirect = () => {
    redirect(`/${locale}/login`);
  };

  const [show, setShow] = useState(false);
  return (
    <div>
      <div className={style.topcont}>
        <h1 className={style.heading}>Display forum</h1>
        <div>
          {/* <Link href={`/${locale}/upload`}> */}
          <button onClick={handleRedirect}>Ask a question</button>
          {/* </Link> */}
          <button>Login</button>
        </div>
      </div>
      <h2 className={style.subheading}>Questions</h2>
      {data?.map((post, i) => (
        <div key={i}>
          <div className={style.userinfo}>
            <p>Posted By: {post.Username}</p>
          </div>
          <div className={style.questioncont}>
            <p className={style.question}>{post.Questions}</p>
          </div>
          <div className={style.answercont}>
            <h2 className={style.subheading}>Answers</h2>
            <div className={style.inputanswer}>
              <form>
                <textarea placeholder="Enter your answer" rows={5} />
                <button>Post</button>
              </form>
            </div>
            <button className={style.showanswer} onClick={() => setShow(!show)}>
              {show ? "Hide Answers" : "Show Answers"}
            </button>
            {show ? (
              <div>
                <div className={style.eachanswer} key={i}>
                  <p className={style.username}>{post.Answername}</p>
                  <p className={style.answertext}>{post.Answers}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Displayforum;
