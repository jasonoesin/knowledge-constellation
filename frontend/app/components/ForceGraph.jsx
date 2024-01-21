"use client";
import { useEffect, useRef } from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "../styles/forceGraph.module.css";

export function ForceGraph({ linksData, nodesData, nodeHoverTooltip }) {
  const containerRef = useRef(null);

  console.log("ForceGraph", nodesData);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData, nodeHoverTooltip]);

  return <div ref={containerRef} className={styles.container} />;
}
