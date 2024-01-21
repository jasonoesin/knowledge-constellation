"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Prompt from "./Prompt";
import { ForceGraph } from "./ForceGraph";
import { result } from "lodash";

export const DisplayGraph = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
        console.log(toGraphData(result));
        setData(result);
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
  }, []);

  return (
    <>
      {data && <ForceGraph nodesData={toGraphData(data)} />}
      <Prompt />
    </>
  );
};

const toGraphData = (data) => {
  const nodes = data.map((obj) => ({
    id: obj.n.elementId,
    labels: obj.n.labels,
    properties: obj.n.properties,
    name: obj.n.properties.name,
  }));

  return nodes;
};
