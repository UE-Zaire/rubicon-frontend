import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import './App.css';
import HistoryGraphNode from './HistoryGraphNode';

let nodes: HistoryGraphNode[] = [];
let links: Array<{source: SimulationNodeDatum, target: SimulationNodeDatum}> = [];
// const nodesDict: {[key: string]: string} = {};

function addNode(i: number) {
    const n: HistoryGraphNode = {
        data: {
            name: 'Website ' + i
        },
        index: nodes.length,
        isSuggestion: false,
        next: null,
        suggestions: ['wikipedia.com' + i, 'stackoverflow.com' + i, 'google.com' + i],
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
    }
    if (nodes.length > 0) {
        const parent = nodes[nodes.length - 1];
        parent.next = n;
        n.x = parent.x + 40
        n.y = parent.y
        links.push({source: nodes[nodes.length - 1], target: n});
    }
    for (let suggestionIndex = 0; suggestionIndex < n.suggestions.length; suggestionIndex++) {
        const suggestion = n.suggestions[suggestionIndex];
        const suggestionNode: HistoryGraphNode = {
            data: {
                name: suggestion
            },
            index: nodes.length,
            isSuggestion: true,
            next: null,
            suggestions: [],
            vx: 0,
            vy: 0,
            x: n.x,
            y: n.y - 20 + 40 * (suggestionIndex % 2),
        }
        nodes.push(suggestionNode);
        links.push({source: n, target: suggestionNode});
    }
    nodes.push(n);
}

for (let i = 0; i < 2; i++) {
    addNode(i);
}

class HistoryGraphView extends React.Component {

    private ref: SVGSVGElement;

    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        const svg = d3.select(this.ref);
        const    width = +svg.attr("width");
        const    height = +svg.attr("height");
        const   color = d3.scaleOrdinal(d3.schemeCategory10);

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
            .force("link", d3.forceLink(links).distance(50).strength(0.5))
            .force("y", d3.forceY((d: any) => d.isSuggestion? d.y: 0))
            .alphaTarget(1)
            .on("tick", ticked)

        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
        let node = g.selectAll('.node');
        restart(simulation);     
        function addNodeTimer(i = 2) {
            setTimeout(() => {
                addNode(i);
                restart(simulation);
                if (i < 1000) {
                    addNodeTimer(i + 1);
                }
            }, 2000)
        }
        addNodeTimer();
        function restart(restartingSimulation: any) {
            // Apply the general update pattern to the nodes.
            node = node.data(nodes, (d: any) => d.index);
            node.exit().remove();
            node = node.enter()
                .append("g").attr("fill", (d: any) => color(d.index)) // ((d.mousedOver === true) || !d.isSuggestion)? color(d.index): 'grey')
                .attr("r", 8)
                .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
                .merge(node);
                node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text((d: any) => d.data.name);

        node.append("image")
            .attr("xlink:href", "https://github.com/favicon.ico")
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 20)
            .attr("height", 20);   

                node
                .on('click', (d: any) => {
                    nodes = nodes.filter(x => x.index !== d.index);
                    let newLinks = links.filter(x => x.source.index !== d.index && x.target.index !== d.index);
                    for (const suggestion of d.suggestions) {
                        nodes = nodes.filter((x: any) => x.data.name !== suggestion);
                        newLinks = newLinks.filter((x: any) => x.source.data.name !== suggestion && x.target.data.name !== suggestion);
                    }
                    const parentList = nodes.filter((x: any) => x.next === d);
                    if (parentList.length !== 0) {
                        const par: HistoryGraphNode = parentList[0];
                        par.next = d.next;
                        if (par.next !== null) {
                            const newLink: {source: HistoryGraphNode, target: HistoryGraphNode} =
                                {source: parentList[0], target: par.next};
                            newLinks.push(newLink);
                        }
                    }
                    links = newLinks;
                    restart(simulation);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                
                // .on('mouseover', (d: any) => {
                //     d.mousedOver = true;
                //     d3.select(this).empty
                // })
                // .on('mouseout', (d: any) => {d.mousedOver = false;});

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
            
            node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)

            link.attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
        }

        function dragstarted(d: any) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart()
            };
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragged(d: any) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
          
          function dragended(d: any) {
            if (!d3.event.active) {
                simulation.alphaTarget(0)
            };
            d.fx = null;
            d.fy = null;
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

export default HistoryGraphView;
