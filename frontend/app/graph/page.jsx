"use client";
import { useState } from "react";
import { DisplayGraph } from "../components/Graph.jsx";
import Header from "../components/Header.jsx";

export default function GraphPage() {
  const [promptResults, setPromptResults] = useState(null);

  const handlePromptResults = (results) => {
    setPromptResults(results);
  };

  return (
    <div className="w-full h-full">
      <DisplayGraph onPromptResults={handlePromptResults} />
      <Header />
    </div>
  );
}
