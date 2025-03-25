"use client";
import { readForum } from "app/api";
import Image from "next/image";
import React, { useEffect } from "react";

export const DesktopHomepage = () => {
  useEffect(() => {
    const getResponse = async () => {
      try {
        const response = await readForum();
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    };

    getResponse();
  });

  return (
    <div>
      <Image src={"/darkened-background.jpeg"} alt="" fill />
    </div>
  );
};
