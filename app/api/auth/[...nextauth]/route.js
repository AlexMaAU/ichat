import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDB } from "@/mongodb";
import User from "@/models/User";

// use NextAuth for authentication, mainly used for login

// 使用 NextAuth() 创建了一个身份验证处理程序（handler)
const handler = NextAuth({
  providers: [
    // 指定了身份验证提供者为 CredentialsProvider，即使用基于用户名和密码的身份验证。
    CredentialsProvider({
      name: "Credentials",
      // components/Form.jsx中signIn()函数调用后，传入的credential_data就是credentials
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        // compare the user input password with hashed password stored in database
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  // 设置NextAuth session的过期时间是4小时
  // 当用户成功进行身份验证时，NextAuth.js 会生成一个包含用户信息的 token。这个 token 通常会被包含在用户的会话中，并且用于验证用户的身份和权限。
  // 通常情况下，不需要直接操作 "token"，而是使用 NextAuth.js 提供的 API 和回调函数来处理用户的会话和身份验证状态。
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },

  // 在代码中并没有直接使用 secret 字段，但它会被 NextAuth.js 内部使用来加密会话
  secret: process.env.NEXTAUTH_SECRET,

  // 定义了一个 callbacks 对象，其中包含一个 session 回调函数。在这个回调函数中，对每个会话进行处理，通过用户的电子邮件地址查找 MongoDB 中的用户，并将用户的 ID 添加到会话中。
  // 也就是说，之前的代码主要是验证和签发session token。验证成功后，为了让session中可以包含用户的所有信息，会通过callbacks来进行查询。
  callbacks: {
    async session({ session }) {
      // 根据session.user.email找到的User实例
      const mongodbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongodbUser._id.toString();

      // 把根据session.user.email找到的User实例中的所有字段信息更新到session.user的所有字段信息，确保session.user是完整的数据
      session.user = { ...session.user, ...mongodbUser._doc };

      return session;
    },
  },
});

// 通过 export 将这个处理程序暴露为 GET 和 POST 方法，以便 Next.js 可以使用它来处理身份验证请求。
export { handler as GET, handler as POST };
