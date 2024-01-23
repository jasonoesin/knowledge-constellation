"use client";
import * as d3 from "d3";
import { useState } from "react";
import CircleLoading from "./CircleLoading";

const Sidebar = ({ linksData, nodesData, onResults }) => {
  const [loading, setLoading] = useState(false);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const categoryMap = nodesData.reduce((acc, node) => {
    const category = node.labels[0];
    const color = colorScale(node.labels[0]);

    acc[category] = {
      count: (acc[category]?.count || 0) + 1,
      color: color,
    };

    return acc;
  }, {});

  const relationMap = linksData.reduce((acc, link) => {
    const relation = link.name;

    acc[relation] = {
      count: (acc[relation]?.count || 0) + 1,
    };

    return acc;
  }, {});

  const legends = Object.entries(categoryMap).map(([category, data]) => (
    <div key={category} className="flex items-center">
      <div
        style={{ backgroundColor: data.color }}
        className="w-4 h-4 mr-2 "
      ></div>
      <p className="text-white ">{`${category} (${data.count})`}</p>
    </div>
  ));

  const relationships = Object.entries(relationMap).map(
    ([relationship, data]) => (
      <div className="bg-gray-500 rounded px-2">{`${relationship} (${data.count})`}</div>
    )
  );

  const handleDeleteGraph = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/openai/delete_graph",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      onResults(data);
      handleRefresh();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-[2rem] right-0 w-[25rem] h-full bg-[#1c1f21] transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 text-white flex flex-col gap-4">
        <strong>Knowledge Graph Analytics Panel</strong>
        <div className="">
          <p>Nodes Categories</p>
          <div className="categories">{legends}</div>
        </div>

        <div className="">
          <p>Nodes Relationships</p>
          <div className="categories flex gap-2 flex-wrap gap-y-1.5 text-[0.85rem]">
            {relationships}
          </div>
        </div>
      </div>

      {loading ? (
        <CircleLoading />
      ) : (
        <div
          onClick={handleDeleteGraph}
          className="fixed right-2 bottom-2 bg-blue-950 rounded px-2 py-1 cursor-pointer"
        >
          Delete Graph
        </div>
      )}
    </div>
  );
};

export default Sidebar;
