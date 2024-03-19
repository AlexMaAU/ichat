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

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  // 在代码中并没有直接使用 secret 字段，但它会被 NextAuth.js 内部使用来加密会话
  secret: process.env.NEXTAUTH_SECRET,

  // 定义了一个 callbacks 对象，其中包含一个 session 回调函数。在这个回调函数中，对每个会话进行处理，通过用户的电子邮件地址查找 MongoDB 中的用户，并将用户的 ID 添加到会话中。
  callbacks: {
    async session({ session }) {
      // 根据session.user.email找到的User实例
      const mongodbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongodbUser._id.toString();

      // 把根据session.user.email找到的User实例中的所有字段信息更新到session.user的所有字段信息，确保session.user是最新的数据
      session.user = { ...session.user, ...mongodbUser._doc };

      return session;
    },
  },
});

// 通过 export 将这个处理程序暴露为 GET 和 POST 方法，以便 Next.js 可以使用它来处理身份验证请求。
export { handler as GET, handler as POST };

