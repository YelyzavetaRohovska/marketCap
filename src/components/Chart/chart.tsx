"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from "d3";

interface DataPoint {
  date: string;
  low: number;
}

interface ChartProps {
  data: DataPoint[];
}

export const Chart = ({ data }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const parsedData = data.map(d => ({
      ...d,
      date: d3.timeParse("%Y-%m-%d %H:%M:%S")(d.date),
    }));

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, width]);

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat("%b %d"));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear()
      .domain([d3.min(parsedData, d => d.low) as number - 1, d3.max(parsedData, d => d.low) as number + 1])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line<DataPoint>()
        .x(d => x(d.date as Date))
        .y(d => y(d.low))
      );

      // Tooltip div
      const tooltip = d3.select(tooltipRef.current).style("opacity", 0);

      const mousemove = (event: MouseEvent) => {
        const [mouseX, mouseY] = d3.pointer(event);
        const xDate = x.invert(mouseX);
        const closestPoint = parsedData.reduce((a, b) => {
          return Math.abs(b.date.getTime() - xDate.getTime()) < Math.abs(a.date.getTime() - xDate.getTime()) ? b : a;
        });

        tooltip
          .style("opacity", 1)
          .html(`
            <strong>Date:</strong> ${d3.timeFormat("%Y-%m-%d %H:%M:%S")(closestPoint.date)}<br>
            <strong>Low:</strong> ${closestPoint.low}
          `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      };

      const mouseout = () => {
        tooltip.style("opacity", 0);
      };

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
  }, [data]);

  return (
    <div className="relative flex justify-center w-full">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="bg-stone-800 border-white rounded p-2 pointer-events-none absolute"></div>
  </div>
  );
};
