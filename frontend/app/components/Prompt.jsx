import React, { useEffect, useState } from "react";
import CircleLoading from "./CircleLoading";
import { AnimatePresence, motion } from "framer-motion";

const Prompt = ({ graphState, setGraphState, onResults, handleRefresh }) => {
  const [definition, setDefinition] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handlePromptButton = async () => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await fetch("http://localhost:3001/openai/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword }),
        credentials: "include",
      });

      const data = await result.json();

      setDefinition(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDefinition = async () => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await fetch(
        "http://localhost:3001/openai/prompt_confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            definition: definition.choices[0].message.content,
          }),
          credentials: "include",
        }
      );

      const data = await result.json();

      onResults(data);
      setGraphState(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefinition = async () => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await fetch("http://localhost:3001/openai/prompt_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          definition: definition.choices[0].message.content,
        }),
        credentials: "include",
      });

      const data = await result.json();

      onResults(data);
      setGraphState(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (graphState == false) {
      setDefinition(null);
      setKeyword("");
    }
  }, [graphState]);

  const handlePromptAnotherKeyword = () => {
    setDefinition(null);
    setKeyword("");
  };

  return (
    <AnimatePresence>
      <form className="!BACKGROUND w-full flex items-center fixed bottom-[2rem] justify-center pointer-events-none">
        {showPrompt ? (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="bg-[#1c1f21] px-4 py-4 rounded-xl min-w-[24rem] max-w-[48rem] h-fit pointer-events-auto flex flex-col gap-3 shadow-2xl relative"
          >
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setShowPrompt(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            {definition ? (
              <>
                <div className="">
                  Definition, detail, and facts generated by LLM :
                </div>

                <div className="text-[0.8rem] bg-[#333336] rounded px-2 py-2">
                  {definition.choices[0].message.content}
                </div>

                {loading ? (
                  <CircleLoading />
                ) : graphState ? (
                  <div className="flex gap-2">
                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handleUpdateDefinition}
                    >
                      Update knowledges
                    </button>
                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handlePromptButton}
                    >
                      Generate another definition or detail
                    </button>
                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handlePromptAnotherKeyword}
                    >
                      Prompt another keyword
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 text-[0.9rem]">
                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handleSaveDefinition}
                    >
                      Save knowledges to graph
                    </button>
                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handlePromptButton}
                    >
                      Generate another definition or detail
                    </button>

                    <button
                      className="w-fit px-4 bg-blue-950 rounded py-1.5"
                      onClick={handlePromptAnotherKeyword}
                    >
                      Prompt another keyword
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="">Write a keyword or an abstract of idea :</div>
                <input
                  type="text"
                  className="text-black rounded px-2 text-[0.8rem] h-[2rem]"
                  placeholder="central processing unit"
                  value={keyword}
                  onChange={handleKeywordChange}
                />
                {loading ? (
                  <CircleLoading />
                ) : (
                  <button
                    className="w-fit px-6 bg-blue-950 rounded py-1.5"
                    onClick={handlePromptButton}
                  >
                    Prompt to LLM
                  </button>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="showPrompt"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="bg-[#1c1f21] rounded py-2 px-2 pointer-events-auto cursor-pointer"
            onClick={() => {
              setShowPrompt(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          </motion.div>
        )}
      </form>
    </AnimatePresence>
  );
};

export default Prompt;
