/* tslint:disable:no-console jsx-no-lambda */
// import { Affix, Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import GraphNode from './GraphNode';
import historyGraph from './HistoryGraph';

class HistoryGraphView extends React.Component {
    public state = { toggle: true, histories: [], currentHistory: '' };

    private ref: SVGSVGElement;
    private historyGraph: any = null;
    private nodes: GraphNode[] = [];
    private links: Array<{ source: SimulationNodeDatum, target: SimulationNodeDatum }> = [];
    private restart: any = null; // is reset to restart function once simulation is loaded

    public getUserGraphs = () => {
        console.log('get the user graphs')
        axios.get('/api/histories')
            .then((result: any) => {

                console.log('results', result.data)
                // console.log('sum shit yo', result.data[0].nodes);
                
                this.setState({ histories: result.data, currentHistory: JSON.parse(result.data[0].nodes) }, () => {

                    console.log(this, this.historyGraph);
                    this.historyGraph.fromJSON(this.state.currentHistory);
                    this.loadHistory();
                });
            })
            .catch((err: any) => {
                console.error(err);
            })
    }

    public handleChangeHistory = () => {
        this.loadHistory();
    }

    public loadGraph = () => {
        const svg = d3.select(this.ref);
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const simulation = d3.forceSimulation(this.nodes)
            .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
            .force("link", d3.forceLink(this.links).distance(200).strength(0.5))
            .force("y", d3.forceY((d: any) => 100).strength(d => d.isSuggestion ? 0 : 1))// d.isSuggestion? d.y: 0))
            .force("x", d3.forceX(700))
            // .force('center', d3.forceCenter(width / 2, height / 2))
            .alphaTarget(1)
            .on("tick", ticked)
        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let link = g.append("g").attr("stroke", "lightblue").attr("stroke-width", 1.5).selectAll(".link");
        let node = g.selectAll('.node');
        const restart = (restartingSimulation: any) => {
            // Apply the general update pattern to the nodes.
            node = node.data(this.nodes, (d: any) => d.index);
            node.exit().remove();
            node = node.enter()
                .append("g").attr("fill", (d: any) => color(d.index)) // ((d.mousedOver === true) || !d.isSuggestion)? color(d.index): 'grey')
                .attr("r", 8)
                .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
                .merge(node);
            node.append<SVGCircleElement>('circle')
                .attr('r', 40)
                .style('stroke', 'lightblue')
                .style('stroke-width', 2)
                .style('fill', "white")
            node.append("text")
                .attr("dx", -12)
                .attr("dy", ".35em")
                .text((d: any) => d.data.title);


            // node.append("image")
            //     .attr("xlink:href", "https://github.com/favicon.ico")
            //     .attr("x", -8)
            //     .attr("y", -8)
            //     .attr("width", 20)
            //     .attr("height", 20)
            node.on('click', (d: any) => {
                    // TODO: DELETE THE NODE
                    // throw('error');
                    this.nodes = this.nodes.filter(n => (n.id !== d.id) && n.anchorId !== d.id);
                    this.links = this.links.filter((l: any) => l.source.id !== d.id && l.target.id !== d.id);
                    this.nodes = this.nodes.filter(n => n.anchorId !== n.id);
                    if (!d.isSuggestion) {
                        const next = this.nodes.filter(n => n.prevId === d.id)[0];
                        const prev = this.nodes.filter(n => n.id === d.prevId)[0];
                        if (next !== undefined && prev !== undefined) {
                            next.prevId = prev.id;
                            this.links.push({
                                source: prev,
                                target: next
                            })
                        }
                    }
                    restart(simulation);
                })
            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

            // .on('mouseover', (d: any) => {
            //     d.mousedOver = true;
            //     d3.select(this).empty
            // })
            // .on('mouseout', (d: any) => {d.mousedOver = false;});

            // Apply the general update pattern to the links.
            link = link.data(this.links, (d: { source: SimulationNodeDatum, target: SimulationNodeDatum }) =>
                d.source.index + "-" + d.target.index)
            link.exit().remove();
            link = link.enter().append("line").merge(link);

            // Update and restart the simulation.
            restartingSimulation.nodes(this.nodes);
            restartingSimulation.force("link").links(this.links);
            restartingSimulation.alpha(1).restart();
        }

        restart(simulation);

        this.restart = restart.bind(this, simulation);

        function ticked() {
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

    public componentDidMount() {
        console.log('hello')
        this.historyGraph = new historyGraph();
        this.getUserGraphs();
    }

    public render() {
        const width = window.innerWidth;
        const height = window.innerHeight / 5;
        const style = {
            backgroundColor: 'white',
            height,
            marginBottom: "-8px",
            width,
        };

        const show = (
                <svg style={style} ref={(ref: SVGSVGElement) => this.ref = ref} />
        );

        return (
            show
        );
    }

    private loadHistory() {
        // chrome.runtime.sendMessage({type: "getNodesAndLinks"}, (response) => {
        const response = this.historyGraph.generateGraph();
        console.log({response});
        const nodes = response.nodes;
        const links = response.links;
        this.nodes = Object.keys(nodes).map(id => nodes[id]);
        this.links = links.map((link: any) => ({ source: nodes[link.source], target: nodes[link.target] }));
        if (this.restart !== null) {
            this.restart();
        } else {
            this.loadGraph();
        }
        // });

    }
}

export default HistoryGraphView;