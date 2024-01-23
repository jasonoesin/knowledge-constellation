"use client";
import { useState } from "react";
import { DisplayGraph } from "./components/Graph.jsx";
import Header from "./components/Header.jsx";

export default function GraphPage() {
  const [promptResults, setPromptResults] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handlePromptResults = (results) => {
    setPromptResults(results);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="w-full h-full">
      <DisplayGraph
        onPromptResults={handlePromptResults}
        handleRefresh={handleRefresh}
      />
      <Header />
    </div>
  );
}
