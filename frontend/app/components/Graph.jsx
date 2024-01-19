"use client";
import React from "react";
import { useEffect } from "react";
import Graph from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  useLoadGraph,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import Prompt from "./Prompt";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();

    graph.addNode("first", {
      x: 0,
      y: 0,
      size: 15,
      label: "My first node",
      color: "#FA4F40",
    });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const DisplayGraph = () => {
  return (
    <SigmaContainer
      style={{
        backgroundColor: "#121112",
      }}
      settings={{
        labelColor: {
          color: "white",
        },
        hoverRenderer: (context, data, settings) => {
          settings.labelColor = {
            color: "white",
          };
        },
      }}
    >
      <LoadGraph />
      <Prompt />
    </SigmaContainer>
  );
};
