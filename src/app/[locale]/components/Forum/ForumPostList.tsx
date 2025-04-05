"use client";
import { readForum } from "app/api";
import React, { useEffect, useState } from "react";

export interface Post {
  Answername: string;
  Answers: { question: string };
  Description: string;
  Questions: string;
  Title: string;
  Username: string;
  createdAt: string;
  documentId: string;
  id: number;
  locale: string;
  publishedAt: string;
  updatedAt: string;
}

const ForumPostList = () => {
  const [data, setData] = useState<Post[]>([]);
  useEffect(() => {
    const getResponse = async () => {
      try {
        const response = await readForum();
        setData(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    getResponse();
  });

  return (
    <div>
      {data.map((post) => (
        <div key={post.Title}>
          <div>{post.Title}</div>
        </div>
      ))}
    </div>
  );
};

export default ForumPostList;
