"use client";

import Loader from "@/components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  // 当 user 发生变化时，会执行传入的箭头函数。在函数体内，首先检查 user 是否存在，如果存在，则调用 reset 函数，将表单的初始值设置为当前用户的用户名和头像。
  // 然后，将 loading 设置为 false，表示用户数据已经加载完成。
  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  // 使用 useForm 钩子从 react-hook-form 库中获取表单相关的注册、监视、设置值、提交等函数，并将其存储在相应的变量中。
  // watch 是 react-hook-form 提供的一个函数，用于监视表单字段的值的变化。
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    // react-hook-form 库提供的一个函数，用于设置表单字段的值
    setValue("profileImage", result?.info?.secure_url);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="edit-profile">
        <div className="input">
          {/* register 函数是 react-hook-form 库提供的一个函数，用于在表单中注册输入字段，并指定其验证规则。
            当你调用 register 函数时，它会返回一个对象，这个对象包含了一些属性和方法，用于管理表单字段的状态和验证规则。
            通过将 register 函数返回的对象解构到 <input> 元素中，可以在输入框中注册字段并添加验证规则，使得表单具备了输入字段的验证功能，并且能够显示相应的错误信息。*/}
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 5) {
                  return "Username must be at least 5 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>

        {/* cloudinary自带的API，点击后会打开图片上传界面 */}
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={uploadPhoto}
          uploadPreset="nj5wdg8u"
        >
          <div className="flex items-center justify-between">
            <img
              src={
                // watch("profileImage") 用于监视名为 "profileImage" 的表单字段的变化。当这个字段的值发生变化时，watch 函数会自动更新，并返回最新的值。
                watch("profileImage") ||
                user?.profileImage ||
                "/assets/person.jpg"
              }
              alt="profile"
              className="w-40 h-40 rounded-full"
            />
            <p className="text-body-bold">Upload new photo</p>
          </div>
        </CldUploadButton>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;

