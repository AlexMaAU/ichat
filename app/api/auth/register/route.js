import User from "@/models/User";
import { connectToDB } from "@/mongodb";
import { hash } from "bcryptjs";

// api/auth是用于处理API路由，而不是页面路由
// [...nextauth]表示动态路由，任何发送到 /api/auth 及其子路径的请求都会被该文件处理

// for user signup
export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { username, email, password } = body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response("User already exists", {
        status: 400,
      });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new user", {
      status: 500,
    });
  }
};
