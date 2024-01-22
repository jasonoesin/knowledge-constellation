import React from "react";
import lottieJson from "../animations/circle-loading.json";
import Lottie from "react-lottie";

const CircleLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={100} width={100} />;
};

export default CircleLoading;
