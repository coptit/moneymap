import { useState } from "react";
import * as EmailValidator from "email-validator";
import { client } from "../App";
import React from "react";
import { User } from "../App";

export function Login({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<User>>;
}) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState(0);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);

  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <button
          className={`p-2 rounded border-solid
            border-2 border-black hover:border-[#49A8FF] hover:scale-105 duration-300
            hover:bg-[#49A8FF] hover:text-white disabled:opacity-50 disabled:scale-100
            active:bg-black active:text-white m-5 ${
              mode === 0 ? "bg-[#49A8FF]" : ""
            }`}
          onClick={(e) => {
            e.preventDefault();
            setMode(0);
            setName("");
            setEmail("");
            setPassword("");
          }}
        >
          Login
        </button>
        <br />
        <button
          className={`p-2 rounded border-solid
            border-2 border-black hover:border-[#49A8FF] hover:scale-105 duration-300
            hover:bg-[#49A8FF] hover:text-white disabled:opacity-50 disabled:scale-100
            active:bg-black active:text-white m-5 ${
              mode === 1 ? "bg-[#49A8FF]" : ""
            }`}
          onClick={(e) => {
            e.preventDefault();
            setMode(1);
            setName("");
            setEmail("");
            setPassword("");
          }}
        >
          Sign Up
        </button>
      </div>
      <div className="bg-white w-96 m-8 min-w-[360px] rounded-[15px]">
        <div className="flex flex-col px-7 py-5">
          {mode === 1 ? (
            <div>
              <h1 className="text-center text-xl ">User Sign Up</h1>
              <span className="text-[15px] py-2">Name</span>
              <br />
              <input
                placeholder="Your Name"
                type="text"
                id="password"
                className="p-2 rounded border-[2px] outline-none border-gray-300 py-2"
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </div>
          ) : (
            <h1 className="text-center text-xl ">User Login</h1>
          )}

          <span className="text-[15px] py-2">Email</span>
          <input
            placeholder="Your Email"
            type="email"
            id="email"
            autoComplete="email"
            className="p-2 rounded border-[2px] outline-none border-gray-300 py-2"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");

              if (EmailValidator.validate(email)) {
                setContinueButtonDisabled(false);
              } else {
                setContinueButtonDisabled(true);
              }
            }}
          />

          <span className="text-[15px] py-2">Password</span>
          <input
            placeholder="Your Password"
            type="password"
            id="password"
            className="p-2 rounded border-[2px] outline-none border-gray-300 py-2"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <div
            className={`bg-[#FA9884] text-center rounded p-2 m-2 ${
              error === "" ? "hidden" : ""
            }`}
          >
            {error}
          </div>
          <button
            disabled={continueButtonDisabled}
            className="p-2 rounded-full mx-14 my-4 border-solid
            border-2 border-black hover:border-[#49A8FF] hover:scale-105 duration-300
            hover:bg-[#49A8FF] hover:text-white disabled:opacity-50 disabled:scale-100
            active:bg-black active:text-white"
            onClick={async (e) => {
              e.preventDefault;

              if (mode === 0) {
                const user = await client.login.mutate({
                  email,
                  password,
                });

                if (!user.auth) {
                  setError("Username or Password is Invalid");
                  return;
                }

                const userLogin: User = {
                  name: user?.user?.name || "",
                  email: user?.user?.email || "",
                  auth: user.auth,
                };
                setUser(userLogin);
                window.localStorage.setItem("user", JSON.stringify(userLogin));
              } else {
                const user = await client.signup.mutate({
                  name,
                  email,
                  password,
                });

                if (!user.valid) {
                  setError("Email already in use, try with different email");
                  return;
                }

                const userLogin: User = {
                  name: user?.user?.name || "",
                  email: user?.user?.email || "",
                  auth: true,
                };
                setUser(userLogin);
                window.localStorage.setItem("user", JSON.stringify(userLogin));
              }
            }}
          >
            {mode === 0 ? "Login" : "Sign UP"}
          </button>
        </div>
      </div>
    </div>
  );
}
