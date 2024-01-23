import React from "react";
import CircleLoading from "./CircleLoading";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <CircleLoading />
    </div>
  );
};

export default LoadingPage;
