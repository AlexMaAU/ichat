"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const TopBar = () => {
  // usePathname - get current path name
  const pathname = usePathname();

  // 在 handleLogout 函数中，调用了 signOut 函数，并传入了一个对象作为参数，其中包含了 callbackUrl 字段。
  // 这个 callbackUrl 字段用于指定用户在成功注销后要重定向的页面的 URL。
  // 调用执行signOut函数以后，会话中的 token 会被清空。
  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  // 调用Provider中传递的NextAuth session信息
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="topbar">
      <Link href="/chats">
        <img src="/assets/logo.png" alt="logo" className="logo" />
      </Link>

      <div className="menu">
        <Link
          href="/chats"
          className={`${
            pathname === "/chats" ? "text-red-1" : ""
          } text-heading4-bold`}
        >
          Chats
        </Link>
        <Link
          href="/contacts"
          className={`${
            pathname === "/contacts" ? "text-red-1" : ""
          } text-heading4-bold`}
        >
          Contacts
        </Link>

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;

