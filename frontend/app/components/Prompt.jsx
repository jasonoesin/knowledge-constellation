import React, { useState } from "react";
import CircleLoading from "./CircleLoading";

const Prompt = ({ onResults }) => {
  const [definition, setDefinition] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeywordChange = (event) => {
    console.log(event.target.value);
    setKeyword(event.target.value);
  };

  const handleButtonClick = async () => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/openai/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDefinition(data);
      onResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="!BACKGROUND w-full flex items-center fixed bottom-[4rem] justify-center pointer-events-none">
      <div className="bg-[#1c1f21] px-4 py-4 rounded-xl w-[22rem] h-fit pointer-events-auto flex flex-col gap-3 shadow-2xl">
        <div className="">Write a keyword or an abstract of idea :</div>

        <input
          type="text"
          className="w-full text-black rounded px-2 text-[0.8rem] h-[2rem]"
          placeholder="central processing unit"
          value={keyword}
          onChange={handleKeywordChange}
        />

        {loading ? (
          <CircleLoading />
        ) : (
          <button
            className="w-fit px-6 bg-blue-950 rounded py-1.5"
            onClick={handleButtonClick}
          >
            Prompt to LLM
          </button>
        )}
        {/* 
        {definition && (
          <div className="mt-3 text-white">Definition: {definition}</div>
        )} */}
      </div>
    </form>
  );
};

export async function getServerSideProps() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}

export default Prompt;
