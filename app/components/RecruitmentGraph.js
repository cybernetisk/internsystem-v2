
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { cybTheme } from "./themeCYB";
import { Box } from "@mui/material";
import { getUserInitials } from "@/app/components/textUtil"

const ForceGraph = ({ data }) => {
  const svgRef = useRef();
  
  useEffect(() => {

    const svg = d3.select(svgRef.current);
    const containerRect = svgRef.current.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;
    
    const labelColour = "white";
    const linkColour = "white";
    const nodeColour = cybTheme.palette.primary.main;
    const nodeStrokeColour = "black";
    
    const node_radius = 24;
    const arrowPath = "M 4 -2 L 10 1 L 4 4";
    
    const nodes = data.nodes.map((e) => ({ ...e, name: getUserInitials(e) }));
    const links = data.links.map((e) => ({
      source: e.source.id,
      target: e.target.id,
    }));

    // Clear the previous graph
    svg.selectAll("*").remove();

    // Set up the simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .distance(100)
          .id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(node_radius + 5));

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("marker-end", "url(#arrowhead-not-highlighted)")
      .attr("stroke", linkColour)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)

    // arrow
    svg
      .append("marker")
      .attr("id", "arrowhead-not-highlighted")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", node_radius - 2)
      .attr("refY", 1)
      .attr("orient", "auto")
      .attr("markerWidth", 13)
      .attr("markerHeight", 13)
      .append("svg:path")
      .attr("d", arrowPath)
      .attr("xoverflow", "visible")
      .attr("fill", linkColour);

    // Add nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", node_radius)
      .attr("stroke-width", 2)
      .attr("stroke", nodeStrokeColour)
      .attr("fill", nodeColour)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Add labels
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", 12)
      .attr("y", 3)
      .text((d) => d.name)
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("fill", labelColour)
      .style("user-select", "none") // Make text unselectable
      .style("-webkit-user-select", "none") // For Safari
      .style("-moz-user-select", "none") // For Firefox
      .style("-ms-user-select", "none") // For IE/Edge
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Update positions on each tick
    simulation.on("tick", () => {

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [data]);

  return (
    <Box sx={{ border: "1px solid black" }}>
      <svg ref={svgRef} width={"100%"} height={600}></svg>
    </Box>
  );
};

export default ForceGraph;
