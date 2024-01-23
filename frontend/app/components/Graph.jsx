"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Prompt from "./Prompt";
import { ForceGraph } from "./ForceGraph";

export const DisplayGraph = ({ onPromptResults, handleRefresh }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [graphState, setGraphState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/graph");

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(toGraphData(result));
        if (result.length == 0) {
          setGraphState(false);
        } else setGraphState(true);
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [onPromptResults]);

  return (
    <>
      {data && (
        <ForceGraph
          nodesData={data.nodes}
          linksData={data.links}
          onResults={onPromptResults}
          handleRefresh={handleRefresh}
        />
      )}
      <Prompt
        setGraphState={setGraphState}
        graphState={graphState}
        onResults={onPromptResults}
        handleRefresh={handleRefresh}
      />
    </>
  );
};

function hasObjectWithId(set, targetId) {
  for (const obj of set) {
    if (obj.id === targetId) {
      return true;
    }
  }
  return false;
}

const toGraphData = (data) => {
  const nodes = new Set();
  const links = new Set();

  data.forEach((obj) => {
    if (!hasObjectWithId(nodes, obj.n.elementId))
      nodes.add({
        id: obj.n.elementId,
        labels: obj.n.labels,
        properties: obj.n.properties,
        name: obj.n.properties.name,
      });

    if (!hasObjectWithId(nodes, obj.m.elementId))
      nodes.add({
        id: obj.m.elementId,
        labels: obj.m.labels,
        properties: obj.m.properties,
        name: obj.m.properties.name,
      });

    links.add({
      name: obj.r.type,
      source: obj.r.startNodeElementId,
      target: obj.r.endNodeElementId,
      distance: obj.r.type.length * 10,
    });
  });

  return {
    nodes: Array.from(nodes),
    links: Array.from(links),
  };
};
