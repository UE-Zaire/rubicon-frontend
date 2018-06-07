/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import * as io from 'socket.io-client';
import { IHistGraphProps } from '../../globalTypes';
import GraphNode from './GraphNode';
import historyGraph from './HistoryGraph';


class HistoryGraphView extends React.Component <IHistGraphProps, {currentHistory: any}>{
    public mouseScrollPosition: any = 'none';
    private ref: SVGSVGElement;
    private historyGraph: any = null;
    private nodes: GraphNode[] = [];
    private links: Array<{ source: SimulationNodeDatum, target: SimulationNodeDatum }> = [];
    private restart: any = null; // is reset to restart function once simulation is loaded
    private socket = io();

    constructor(props: IHistGraphProps) {
        super(props)
        this.state = { currentHistory: props.history };
    }

    public loadGraph = () => {
        const svg = d3.select(this.ref);
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const simulation = d3.forceSimulation(this.nodes)
            .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
            .force("link", d3.forceLink(this.links).distance((d: any) => d.target.isSuggestion ? 60 : 100).strength(0.5))
            .force("y", d3.forceY((d: any) => 100).strength(d => d.isSuggestion ? 0 : .5))// d.isSuggestion? d.y: 0))
            .force("x", d3.forceX((d: any) => d.x).strength(d => d.isSuggestion ? 0 : .5))
            .alphaTarget(1)
        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let link = g.append("g").attr("stroke", "lightblue").attr("stroke-width", 2).selectAll(".link");
        let node = g.selectAll('.node');
        const restart = (restartingSimulation: any) => {
            // Apply the general update pattern to the nodes.
            node = node.data(this.nodes, (d: any) => d.index);
            node.exit().remove();
            node = node.enter()
                .append("g")// ((d.mousedOver === true) || !d.isSuggestion)? color(d.index): 'grey')
                .attr("r", 8)
                .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
                .merge(node);
            node.append<SVGCircleElement>('circle')
                .attr('r', (d: any) => d.isSuggestion ? 20 : 40)
                .style('stroke', 'lightblue')
                .style('stroke-width', 2)
                .style('fill', (d: any) => d.isSuggestion ? "#E8F7FB" : "white")
                .on("mouseenter", (d: any) => {
                    const { title } = d.data;
                    // tslint:disable-next-line:no-shadowed-variable
                    d3.selectAll('circle').filter((d: any) => d.data.title === title)
                        .style("fill", "lightblue");
                })
                .on("mouseleave", (d: any) => {
                    const { title } = d.data;
                    // tslint:disable-next-line:no-shadowed-variable
                    d3.selectAll('circle').filter((d: any) => d.data.title === title)
                        // tslint:disable-next-line:no-shadowed-variable
                        .style("fill", (d: any) => d.isSuggestion ? "#E8F7FB" : "white");
                })
            node.append("text")
                .attr("dx", (d: any) => d.isSuggestion ? -25 : -40)    
                .attr("dy", ".35em")
                .attr("fill", (d: any) => color(d.index))
                .text((d: any) => d.data.title)
                .style("font-family", "Avenir")
                .style("font-size", (d: any) => d.isSuggestion ? "10px" : "14px");  

            node.on('click', (d: any) => {
                window.location = d.data.url;
                this.socket.emit('historyForExtension', { selectedGraphName: this.state.currentHistory.name, userId: this.props.user.id });

                restart(simulation);
            })
            node.on('contextmenu', (d: any) => {
                d3.event.preventDefault();
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

            // node.on('mouseover', (d: any) => {
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

        const ticked = () => {
            node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
            if (this.mouseScrollPosition === 'left') {
                simulation.force("x", d3.forceX((d: any) => d.x - 10).strength(d => d.isSuggestion ? 0 : .5))
            } else if (this.mouseScrollPosition === 'right') {
                simulation.force("x", d3.forceX((d: any) => d.x + 10).strength(d => d.isSuggestion ? 0 : .5))
            }
            link.attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
        }

        simulation.on("tick", ticked);
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
                simulation.alphaTarget(1)
            };
            d.fx = null;
            d.fy = null;
        }
    }

    public componentDidMount() {
        console.log('mounting histgraphview with state', this.state.currentHistory)
        this.historyGraph = new historyGraph();
        this.historyGraph.fromJSON(JSON.parse(this.state.currentHistory.nodes));
        const res = this.historyGraph.generateGraph();
        const nodes = res.nodes;
        const links = res.links;

        console.log({links}, {nodes});
        this.nodes = Object.keys(nodes).map(id => nodes[id]);
        this.links = links.map((link: any) => ({ source: nodes[link.source], target: nodes[link.target] }));
        const nonSugNodes = Object.keys(nodes).map((key: any) => nodes[key]).filter((node: any) => !node.isSuggestion).length;
        Object.keys(nodes).forEach((n: any) => nodes[n].x += this.props.width - (this.props.width * (1 / (nonSugNodes === 1 ? 2 : nonSugNodes))));
        if (this.restart !== null) {
            this.restart();
        } else {
            this.loadGraph();
        }
        this.loadHistory();
    }


    public handleScroll = (evt: any) => {
        if (evt.clientX > window.innerWidth - (this.props.width * 0.1)) {
            this.mouseScrollPosition = 'right';
        } else if (evt.clientX < window.innerWidth - (this.props.width * 0.9)) {
            this.mouseScrollPosition = 'left';
        } else {
            this.mouseScrollPosition = 'none';
        }
    }

    public handleExitScroll = () => {
        this.mouseScrollPosition = 'none';
    }
    

    public render() {
        // const width = window.innerWidth;
        // const height = window.innerHeight / 5;
        const style = {
            backgroundColor: 'white',
            height: this.props.height,
            marginBottom: "-8px",
            width: this.props.width,
        };

        const show = (
                <svg style={style} ref={(ref: SVGSVGElement) => this.ref = ref} onMouseMove={this.handleScroll} onMouseOut={this.handleExitScroll}/>
        );

        return (
            show
        );
    }

    private loadHistory = () => {
        // chrome.runtime.sendMessage({type: "getNodesAndLinks"}, (response) => {
        const response = this.historyGraph.generateGraph();
        console.log({response});
        const nodes = response.nodes;
        const links = response.links;
        this.nodes = Object.keys(nodes).map(id => nodes[id]);
        const nonSugNodes = Object.keys(nodes).map((key: any) => nodes[key]).filter((node: any) => !node.isSuggestion).length;
        Object.keys(nodes).forEach((n: any) => nodes[n].x += this.props.width - (this.props.width * (1 / (nonSugNodes === 1 ? 2 : nonSugNodes))));
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