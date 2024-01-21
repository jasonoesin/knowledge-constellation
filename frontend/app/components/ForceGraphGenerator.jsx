import * as d3 from "d3";
import styles from "../styles/forceGraph.module.css";

export function RunForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const color = () => {
    return "#ffffff";
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

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(300)
    )
    .force("charge", d3.forceManyBody().strength(-5000))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const zoom = d3
    .zoom()
    .translateExtent([
      [-width / 2, -height / 2],
      [width / 2, height / 2],
    ])
    .on("zoom", function (event) {
      d3.select(".nodes").attr("transform", event.transform);
      d3.select(".links").attr("transform", event.transform);
      d3.select(".link-labels").attr("transform", event.transform);
    });

  d3.select("svg").call(zoom);

  function center() {
    d3.select("svg")
      .transition()
      .call(zoom.translateTo, width / 2, height / 2);
  }

  const linkGroup = svg.append("g").classed("links", true);
  const linkLabelGroup = svg.append("g").classed("link-labels", true);

  const linkLabel = linkLabelGroup
    .selectAll("text")
    .data(links)
    .enter()
    .append("text")
    .attr("class", "link-label")
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .attr("dy", "-1em")
    .classed("fill-white", true)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("transform", function (d) {
      const angle =
        (Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180) /
        Math.PI;

      const adjustedAngle = d.target.x > d.source.x ? angle : angle + 180;

      return `rotate(${adjustedAngle},${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`;
    });
  const link = linkGroup
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .classed("nodes", true)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 32)
    .attr("fill", color)
    .attr("fill", (d) => colorScale(d.labels[0]))
    .classed("cursor-pointer", true)
    .call(drag(simulation));

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    linkLabel
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2)
      .attr("transform", function (d) {
        const angle =
          (Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180) /
          Math.PI;

        const adjustedAngle = d.target.x > d.source.x ? angle : angle + 180;

        return `rotate(${adjustedAngle},${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`;
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
