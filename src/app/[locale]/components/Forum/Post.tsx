"use client";
import React, { useState } from "react";
import style from "../../forum/page.module.css";
import { postAnswer, type PostType } from "./Displayforum";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
// import axios from "axios";

const Post = (props: PostType) => {
  const [show, setShow] = useState(false);

  const session = useSession();

  const [answer, setAnswer] = useState<postAnswer>({
    answerText: "",
    answerAuthor: session.data?.user?.name || "",
  });
  const [a, formerArray] = useState<postAnswer[]>(props.Answers);

  const addAnswer = () => {
    console.log(session);
    if (session.status === "unauthenticated") redirect(`/ru/login`);
    if (!answer.answerText.length) {
      alert("Введите текст");
    } else {
      const arr = a ?? [];
      arr.push(answer);
      formerArray(arr);
    }
    // submitAnswer();}
  };

  // const submitAnswer = () => {
  //   axios.put(`http://localhost:1337/api/simodo-forums/[7]`, {
  //     data: { Answers: [a] },
  //   });
  // };

  return (
    <div
      style={{ borderBottom: "1px solid grey", paddingBottom: "8px" }}
      data-testid={"POST_TEST_ID"}
    >
      <div className={style.userinfo}>
        <p>Автор: {props.Username}</p>
      </div>
      <div className={style.questioncont}>
        <p className={style.question}>{props.Description}</p>
      </div>
      <div className={style.answercont}>
        <h2 className={style.subheading} data-testid={"ANSWERS_COUNT_TEST_ID"}>
          Ответы {a?.length}
        </h2>
        <div className={style.inputanswer}>
          <div>
            <textarea
              placeholder="Введите свой ответ"
              rows={5}
              onChange={(e) =>
                setAnswer({
                  answerText: e.target.value,
                  answerAuthor: session.data?.user?.name || "",
                })
              }
              data-testid={"TEXTAREA_TEST_ID"}
            />
            <button
              onClick={() => addAnswer()}
              data-testid={"ADD_ANSWER_BUTTON_TEST_ID"}
            >
              Ответить
            </button>
          </div>
        </div>
        <button
          className={style.showanswer}
          onClick={() => setShow(!show)}
          data-testid={"SHOW_ANSWERS_BUTTON_TEST_ID"}
        >
          {show ? "Hide Answers" : "Show Answers"}
        </button>
        {show ? (
          <div data-testid={"ANSWER_TEST_ID"}>
            {a?.map((answer, i) => (
              <div className={style.eachanswer} key={i}>
                <p className={style.username}>{answer.answerAuthor}</p>
                <p className={style.answertext}>{answer.answerText}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
