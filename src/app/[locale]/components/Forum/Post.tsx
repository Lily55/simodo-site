"use client";
import React, { useState } from "react";
import style from "../../forum/page.module.css";
import { postAnswer, type PostType } from "./Displayforum";
// import axios from "axios";

const Post = (props: PostType) => {
  const [show, setShow] = useState(false);

  const [answer, setAnswer] = useState<postAnswer>({
    answerText: "",
    answerAuthor: "Jorje",
  });
  const [a, formerArray] = useState<postAnswer[]>(props.Answers);

  const addAnswer = () => {
    const arr = a ?? [];
    arr.push(answer);
    formerArray(arr);
    // submitAnswer();
  };

  // const submitAnswer = () => {
  //   axios.put(`http://localhost:1337/api/simodo-forums/[7]`, {
  //     data: { Answers: [a] },
  //   });
  // };

  return (
    <div>
      <div className={style.userinfo}>
        <p>Автор: {props.Username}</p>
      </div>
      <div className={style.questioncont}>
        <p className={style.question}>{props.Description}</p>
      </div>
      <div className={style.answercont}>
        <h2 className={style.subheading}>Ответы {a?.length}</h2>
        <div className={style.inputanswer}>
          <div>
            <textarea
              placeholder="Введите свой ответ"
              rows={5}
              onChange={(e) =>
                setAnswer({ answerText: e.target.value, answerAuthor: "Jorje" })
              }
            />
            <button onClick={() => addAnswer()}>Ответить</button>
          </div>
        </div>
        <button className={style.showanswer} onClick={() => setShow(!show)}>
          {show ? "Hide Answers" : "Show Answers"}
        </button>
        {show ? (
          <div>
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
