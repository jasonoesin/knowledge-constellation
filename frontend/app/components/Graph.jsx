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
        setData(toGraphData(result));
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
      {data && <ForceGraph nodesData={data.nodes} linksData={data.links} />}
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

  const links = data.map((obj) => ({
    name: obj.r.type,
    source: obj.r.startNodeElementId,
    target: obj.r.endNodeElementId,
  }));

  const removeDuplicateNodes = (nodes) => {
    const uniqueNodes = [];
    const nodeIds = new Set();

    nodes.forEach((node) => {
      if (!nodeIds.has(node.id)) {
        uniqueNodes.push(node);
        nodeIds.add(node.id);
      }
    });

    return uniqueNodes;
  };

  const removeDuplicateLinks = (links) => {
    const uniqueLinks = [];
    const linkSet = new Set();

    links.forEach((link) => {
      const key = `${link.source}-${link.target}`;

      if (!linkSet.has(key)) {
        uniqueLinks.push(link);
        linkSet.add(key);
      }
    });

    return uniqueLinks;
  };

  return {
    nodes: removeDuplicateNodes(nodes),
    links: removeDuplicateLinks(links),
  };
};
