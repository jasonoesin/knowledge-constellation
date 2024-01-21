import * as d3 from "d3";
import styles from "../styles/forceGraph.module.css";

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = [];
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const color = () => {
    return "#9D79A0";
  };

  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  //   const tooltip = document.querySelector("#graph-tooltip");
  //   if (!tooltip) {
  //     const tooltipDiv = document.createElement("div");
  //     tooltipDiv.classList.add(styles.tooltip);
  //     tooltipDiv.style.opacity = "0";
  //     tooltipDiv.id = "graph-tooltip";
  //     document.body.appendChild(tooltipDiv);
  //   }
  //   const div = d3.select("#graph-tooltip");

  //   const addTooltip = (hoverTooltip, d, x, y) => {
  //     div.transition().duration(200).style("opacity", 0.9);
  //     div
  //       .html(hoverTooltip(d))
  //       .style("left", `${x}px`)
  //       .style("top", `${y - 28}px`);
  //   };

  //   const removeTooltip = () => {
  //     div.transition().duration(200).style("opacity", 0);
  //   };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-150))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const zoom = d3.zoom().on("zoom", function (event) {});

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(zoom);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", color)
    .call(drag(simulation));

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .call(drag(simulation));

  //   label
  //     .on("mouseover", (d) => {
  //       addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
  //     })
  //     .on("mouseout", () => {
  //       removeTooltip();
  //     });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
