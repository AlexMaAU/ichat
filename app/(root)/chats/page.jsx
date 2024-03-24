"use client";

import { useSession } from "next-auth/react";
import React from "react";

const chats = () => {
  const { data: session } = useSession();

  console.log(session); // 从浏览器的inspect的Network里，可以看见session中包含了token

  return <div>Chats Page</div>;
};

export default chats;

