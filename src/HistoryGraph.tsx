import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import './App.css';

class HistoryGraph extends React.Component {

    private ref: SVGSVGElement;

    public componentDidMount() {
        const svg = d3.select(this.ref);
        const    width = +svg.attr("width");
        const    height = +svg.attr("height");
        const   color = d3.scaleOrdinal(d3.schemeCategory10);

        const a: SimulationNodeDatum = {index: 1, x: 100, y: 100};
        const    b: SimulationNodeDatum = {index: 2, x: 100, y: 200};
        const    c: SimulationNodeDatum = {index: 3, x: 200, y: 100};
        let    nodes: SimulationNodeDatum[] = [a, b, c];
        let    links: Array<{source: SimulationNodeDatum, target: SimulationNodeDatum}> = [];

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("link", d3.forceLink(links).distance(200))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .alphaTarget(1)
            .on("tick", ticked)

        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
        let node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

        restart(simulation);

        node
        .on('click', (d: any) => {
            nodes = nodes.filter(x => x.index !== d.index);
            links = links.filter(x => x.source.index !== d.index && x.target.index !== d.index)
            restart(simulation)
        });


        d3.timeout(() => {
        links.push({source: a, target: b}); // Add a-b.
        links.push({source: b, target: c}); // Add b-c.
        links.push({source: c, target: a}); // Add c-a.
        restart(simulation);
        }, 1000);

        // d3.interval(() => {
        // nodes.pop(); // Remove c.
        // links.pop(); // Remove c-a.
        // links.pop(); // Remove b-c.
        // restart(simulation);
        // }, 2000, d3.now());

        // d3.interval(() => {
        // nodes.push(c); // Re-add c.
        // links.push({source: b, target: c}); // Re-add b-c.
        // links.push({source: c, target: a}); // Re-add c-a.
        // restart(simulation);
        // }, 2000, d3.now() + 1000);

        function restart(restartingSimulation: any) {
            // Apply the general update pattern to the nodes.
            node = node.data(nodes, (d: any) => d.index);
            node.exit().remove();
            node = node.enter().append("circle").attr("fill", (d: any) => color(d.index)).attr("r", 8).merge(node);

            // Apply the general update pattern to the links.
            link = link.data(links, (d: {source: SimulationNodeDatum, target: SimulationNodeDatum})  =>
                d.source.index + "-" + d.target.index)
            link.exit().remove();
            link = link.enter().append("line").merge(link);

            // Update and restart the simulation.
            restartingSimulation.nodes(nodes);
            restartingSimulation.force("link").links(links);
            restartingSimulation.alpha(1).restart();
        }

        function ticked() {
            node.attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y)

            link.attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
        }
    }

  public render() {
    return (
      <div className="App">
        <svg width="960" height="500"  ref={(ref: SVGSVGElement) => this.ref = ref}/>
      </div>
    );
  }
}

export default HistoryGraph;
