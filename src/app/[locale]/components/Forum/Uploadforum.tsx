"use client";
import React, { useState } from "react";
import axios from "axios";
import style from "../../forum/page.module.css";
import Link from "next/link";

const url = "http://localhost:1337/api/simodo-forums";

const Uploadforum = ({ locale }: { locale: string }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const sendData = () => {
    axios.post(url, {
      data: {
        Title: name,
        Questions: description,
      },
    });
  };

  return (
    <div className={style.uploadpage}>
      <div className={style.topcont}>
        <h1>Ask a question</h1>
        <Link href={`/${locale}/forum`}>
          <button>Forum</button>
        </Link>
      </div>
      <div className={style.formcont}>
        <form className={style.uploadform}>
          <input
            type="text"
            placeholder="Enter your title"
            maxLength={74}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Enter your description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              sendData();
            }}
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
};
export default Uploadforum;
