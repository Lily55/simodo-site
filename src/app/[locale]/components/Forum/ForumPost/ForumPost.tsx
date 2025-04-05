import { getTranslations } from "next-intl/server";
import React from "react";

type ForumPostProps = {
  title: string;
  description: string;
  author: string;
};

const ForumPost = async ({ title, description, author }: ForumPostProps) => {
  // const t = await getTranslations();

  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{author}</div>
    </div>
  );
};

export default ForumPost;
