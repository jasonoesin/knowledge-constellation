"use client";
import { useState } from "react";
import Image from "next/image";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    console.log(
      "Logging in with username:",
      username,
      "and password:",
      password
    );
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-[80%] h-[80%] bg-[#1c1f21] rounded-2xl flex flex-row">
        <div className="w-1/3 px-[6.5rem] py-[12rem]">
          <div className="text-2xl font-bold mb-4">Login</div>
          <div className="flex flex-col gap-4">
            <div className="">
              Derive insights using artificial intelligence and knowledge graphs
            </div>

            <div className="flex flex-col gap-2">
              <div className="">Username*</div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="rounded-full bg-transparent px-3 py-3 text-[0.8rem] border border-gray-500"
                placeholder="username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="">Password*</div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="rounded-full bg-transparent px-3 py-3 text-[0.8rem] border-gray-500 border"
                placeholder="password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center bg-[#333336] rounded-full px-3 py-2 mt-2 shadow-xl"
            >
              Login
            </button>
          </div>
        </div>
        <div className="w-2/3 relative h-full rounded-r-2xl overflow-hidden bg-[#161616]">
          <Image
            src="/background.jpg"
            fill
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
