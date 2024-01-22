"use client";
import { useEffect, useRef, useState } from "react";
import { RunForceGraph } from "./ForceGraphGenerator";
import styles from "../styles/forceGraph.module.css";
import Sidebar from "./Sidebar";
import { Tooltip } from "./Tooltip";

export function ForceGraph({ linksData, nodesData }) {
  const containerRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tooltip, setTooltip] = useState();

  const handleSetTooltip = (obj) => {
    console.log(obj);
    setTooltip(obj);
  };

  const handleSetNoneTooltip = () => {
    setTooltip();
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = RunForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        handleSetTooltip,
        handleSetNoneTooltip
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData]);

  return (
    <div className="h-full w-full">
      <div
        className={`${styles.container} ${
          sidebarOpen ? styles.containerShifted : ""
        }`}
        ref={containerRef}
      />
      <div
        className={`icon fixed top-12 right-5 z-[20] cursor-pointer ${
          sidebarOpen ? styles.iconShifted : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
          onClick={() => {
            toggleSidebar();
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </div>
      {sidebarOpen && <Sidebar nodesData={nodesData} linksData={linksData} />}
      <Tooltip data={tooltip} />
    </div>
  );
}
