import React from "react";

const Prompt = () => {
  return (
    <div className="!BACKGROUND w-full flex items-center fixed bottom-[4rem] justify-center pointer-events-none">
      <div className="bg-gray-800 px-4 py-4 rounded w-[22rem] h-fit pointer-events-auto flex flex-col gap-2 ">
        <div className="">Write a keyword or an abstract of idea :</div>

        <input
          type="text"
          className="w-full text-black rounded px-2 text-[0.8rem] h-[2rem]"
          placeholder="central processing unit"
        />

        <button className="w-fit px-6 bg-blue-950 rounded py-2">
          Prompt to LLM
        </button>
      </div>
    </div>
  );
};

export default Prompt;
