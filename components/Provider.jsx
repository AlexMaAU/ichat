"use client";

import { SessionProvider } from "next-auth/react";

// 在这个 Provider 组件中，它将 SessionProvider 组件包裹在其内部，并传递了 session 作为 prop。
// 这样做的目的是将 NextAuth.js 的会话信息传递给整个应用程序，使得应用中的所有组件都能够访问到用户的登录状态和相关信息。
const Provider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;

