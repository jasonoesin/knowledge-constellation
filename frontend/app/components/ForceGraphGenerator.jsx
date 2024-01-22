import * as d3 from "d3";

export function RunForceGraph(container, linksData, nodesData) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      // need fix
      //   let maxDragHeight = (height / 2) * 0.5;
      //   if (event.y >= maxDragHeight) event.subject.fy = maxDragHeight;
      //   else event.subject.fy = event.y;

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
        .distance(function (link) {
          return link.distance;
        })
    )
    .force("charge", d3.forceManyBody().strength(-5000))
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(-100).strength(0.25));

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 38)
    .attr("refY", 0)
    .attr("fill", "white")
    .attr("markerWidth", 12)
    .attr("markerHeight", 12)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class", "arrowhead");

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
    .classed("text-[0.75rem]", true)
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
    .attr("stroke-width", (d) => Math.sqrt(d.value))
    .attr("marker-end", "url(#arrowhead)");

  const nodeGroup = svg
    .append("g")
    .classed("nodes", true)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("g")
    .data(nodes)
    .join("g")
    .classed("node-group", true)
    .classed("cursor-pointer", true)
    .call(drag(simulation));

  const node = nodeGroup
    .append("circle")
    .attr("r", 35)
    .attr("fill", (d) => colorScale(d.labels[0]));

  const nodeLabel = nodeGroup
    .append("text")
    .attr("class", "node-label")
    .attr("stroke-width", 0)
    .classed("text-[0.75rem]", true)
    .text((d) => {
      if (!d.name) return null;

      const capitalizedName = d.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const radius = 32;
      const maxLength = radius * 2 - 10;
      return truncateText(capitalizedName, maxLength);
    })
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .classed("fill-white", true);

  function truncateText(text, maxLength) {
    if (text.length > maxLength / 6) {
      const truncatedText = text.slice(0, maxLength / 6 - 1) + "…";
      return truncatedText;
    } else {
      return text;
    }
  }

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => {
        // need fix
        // let maxDragHeight = (height / 2) * 0.5;
        // if (d.y >= maxDragHeight) return maxDragHeight;
        // else return d.y;

        return d.y;
      });

    nodeLabel
      .attr("x", (d) => d.x)
      .attr("y", (d) => {
        // need fix
        // let maxDragHeight = (height / 2) * 0.5;
        // if (d.y >= maxDragHeight) return maxDragHeight;
        // else return d.y;

        return d.y;
      });

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

      d3.select("svg").remove();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
