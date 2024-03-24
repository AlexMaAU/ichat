import Form from "@/components/Form";

// (auth)表示route group，本身不会放进URL中，只是用来给页面路由做分组的，因为不同group的页面会有不同的layout

const Login = () => {
  return <Form type="login" />;
};

export default Login;
