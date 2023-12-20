import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { VOTE_LABELS } from './constants';

const PieChart = ({ votable }) => {
    const { positive_votes, negative_votes, votable_type } = votable;
    const positive_label = VOTE_LABELS[votable_type].positive;
    const negative_label = VOTE_LABELS[votable_type].negative;

    useEffect(() => {
        let data;

        if (positive_votes === 0 && negative_votes === 0) {
            data = [
                { name: 'No Vote', value: 1 }
            ];
        } else {
            data = [
                { name: positive_label, value: positive_votes, percentage: votable.positive_percentage },
                { name: negative_label, value: negative_votes, percentage: votable.negative_percentage }
            ];
        }

        drawPieChart(data, `chart-${votable.votable_type}-${votable.id}`, positive_label, negative_label);
    }, [votable, positive_label, negative_label, positive_votes, negative_votes]);

    const drawPieChart = (data, elementId, positiveLabel, negativeLabel) => {
        const width = 700;
        const height = Math.min(width, 370);

        const color = data.length === 1 ? d3.scaleOrdinal().domain(['No Vote']).range(['#808080'])
                                        : d3.scaleOrdinal().domain([positiveLabel, negativeLabel]).range(["white", "black"]);

        const pie = d3.pie().sort(null).value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
        const arcs = pie(data);

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        svg.append("g")
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

        svg.append("g")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("fill", d => {
                if (d.data.name === positiveLabel) return "black";
                if (d.data.name === negativeLabel) return "white";
                return "#FFF";  // Default to white for "No Vote" and any other potential labels
            })
            .style("font-weight", "bold")
            .style("font-size", "2.8em")
            .each(function(d) {
                const text = d3.select(this);
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", "-0.1em")
                    .text(data.length === 1 ? d.data.name : `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

                if (data.length !== 1) {
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", "1.2em")
                        .text(`(${d.data.percentage}%)`);
                }
            });

        document.getElementById(elementId).innerHTML = ''; // Clearing before appending new SVG
        document.getElementById(elementId).appendChild(svg.node());
    };

    return (
        <div className="votable-piechart" id={`chart-${votable.votable_type}-${votable.id}`}>
            {/* Pie chart will be inserted here */}
        </div>
    );
};

export default PieChart;
