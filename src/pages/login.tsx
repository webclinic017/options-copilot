import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Image from "next/image";
import { useRouter } from "next/router";

import useAuth from "../hooks/useAuth";

interface Inputs {
  email: string;
  password: string;
  confirm?: string;
}

const Login = () => {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [login, setLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const watchPassword = watch("password");
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (login) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black  text-white">
      <div className="relative w-[90rem] h-[50rem]  ">
        <div className=" hidden md:block ">
          <Image
            className="rounded-xl"
            src="/LoginBgImage.jpg"
            alt="me"
            layout="fill"
          />
        </div>

        <div className="text-2xl bg-black bg-opacity-30 backdrop-blur-lg shadow-xl rounded drop-shadow-lg h-full w-full md:w-1/2 absolute right-0 top-0">
          <div className="flex mt-8 justify-end px-10">
            <button
              className={`loginButton rounded-l-md ${
                isSigningIn ? "bg-green-500" : "bg-gray-700"
              } `}
              onClick={() => {
                setIsSigningIn(true), reset();
              }}
            >
              Sign In
            </button>
            <button
              className={`loginButton rounded-r-md ${
                isSigningIn ? "bg-gray-700" : "bg-green-500"
              } `}
              onClick={() => {
                setIsSigningIn(false), reset();
              }}
            >
              Sign Up
            </button>
          </div>

          <form
            className="flex flex-col mt-20 px-6 md:px-10  space-y-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-1 md:flex items-center md:space-x-3">
              <h1
                className={`text-3xl font-semibold ${
                  isSigningIn
                    ? "underline underline-offset-8 decoration-green-500"
                    : ""
                } `}
              >
                Sign In
              </h1>
              <p className="self-end">or</p>
              <h1
                className={`text-3xl font-semibold ${
                  !isSigningIn
                    ? "underline underline-offset-8 decoration-green-500"
                    : ""
                } `}
              >
                Sign Up
              </h1>
            </div>

            <div className="space-y-6">
              <label className="inline-block w-full">
                <input
                  className="w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    Please enter a valid email.
                  </p>
                )}{" "}
              </label>
              <label className="inline-block w-full">
                <input
                  className="w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
                  type="password"
                  placeholder="Password"
                  // ref={register({})}
                  name="password"
                  {...register("password", {
                    required: "You must specify a password",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="p-1 text-[13px] font-light  text-orange-500">
                    {errors.password.message}
                  </p>
                )}
              </label>
              {!isSigningIn && (
                <label className="inline-block w-full">
                  <input
                    className="w-full rounded bg-[#333333] px-5 py-3.5 placeholder-[gray] outline-none focus:bg-[#454545]"
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirm", {
                      required: "You must confirm password",

                      validate: (value) =>
                        value === watchPassword || "The passwords do not match",
                    })}
                  />
                  {errors.confirm && (
                    <p className="p-1 text-[13px] font-light  text-orange-500">
                      {errors.confirm.message}
                    </p>
                  )}
                </label>
              )}
            </div>
            <button
              disabled={!isSigningIn}
              className={`w-full rounded bg-gray-800 ${
                isSigningIn ? "opacity-100" : "opacity-75"
              }  py-3 font-semibold`}
              onClick={() => setLogin(true)}
              type="submit"
            >
              Sign In
            </button>
            <button
              disabled={isSigningIn}
              className={`w-full rounded bg-gray-800 ${
                !isSigningIn ? "opacity-100" : "opacity-75"
              }  py-3 font-semibold`}
              onClick={() => setLogin(false)}
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

//TODO
/*
 * DRY ->  Look to Refactor button styling more reusable
 * Create functionality for diff login providers ie github gmail
 */
