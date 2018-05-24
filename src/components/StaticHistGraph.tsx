/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import { IStaticHistProps } from '../globalTypes';
import GraphNode from './extensionGraphs/GraphNode';
import historyGraph from './extensionGraphs/HistoryGraph';

export default class StaticHistGraph extends React.Component <IStaticHistProps, {currentHistory: any}>{
  private ref: SVGSVGElement;
  private historyGraph: any = null;
  private nodes: GraphNode[] = [];
  private links: Array<{ source: SimulationNodeDatum, target: SimulationNodeDatum }> = [];
  // private simulation: any;
  // private restart: any = null;
  
  constructor(props: IStaticHistProps) {
    super(props);
    this.state = { currentHistory: this.props.history }
  }

  // public shouldComponentUpdate(nextProps: IStaticHistProps) {
  //   const nProps = JSON.stringify(nextProps);
  //   console.log(nProps)

  //   return JSON.stringify(this.props) !== nProps; 
  // }

  // public componentDidUpdate() {
  //   this.setState({
  //     currentHistory: this.props.history
  //   }, () => {
  //     this.historyGraph.fromJSON(JSON.parse(this.state.currentHistory.nodes));
  //     this.loadHistory();
  //     this.removeGraph();
  //   })
  // }

  public componentDidMount() {
    this.historyGraph = new historyGraph();
    this.historyGraph.fromJSON(JSON.parse(this.state.currentHistory.nodes));
    const res = this.historyGraph.generateGraph();
    const nodes = res.nodes;
    const links = res.links;

    this.nodes = Object.keys(nodes).map(id => nodes[id]);
    this.links = links.map((link: any) => ({ source: nodes[link.source], target: nodes[link.target] }));
    const nonSugNodes = Object.keys(nodes).map((key: any) => nodes[key]).filter((node: any) => !node.isSuggestion).length;
    Object.keys(nodes).forEach((n: any) => nodes[n].x += this.props.width - (this.props.width * (1 / (nonSugNodes === 1 ? 2 : nonSugNodes))));
    // if (this.restart !== null) {
    //     this.restart();
    // } else {
    //     this.loadGraph();
    // }
    this.loadHistory();
  }

  public render() {
    const style = {
        backgroundColor: 'white',
        height: this.props.height,
        marginBottom: "-8px",
        width: this.props.width,
    };

    const show = (
            <svg style={style} ref={(ref: SVGSVGElement) => this.ref = ref} />
    );

    return (
        show
    );
}

  // private removeGraph = () => {
  //   const graph: any = this.ref;
    
  //   while(graph.hasChildNodes()) {
  //     graph.removeChild(graph.lastChild);
  //   }
  // }
  
  private loadGraph = () => {
    const svg = d3.select(this.ref);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 30, bottom: 30, left: 30, right: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    // this.simulation = d3.forceSimulation(this.nodes)
    //     .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
    //     .force("link", d3.forceLink(this.links).distance((d: any) => d.target.isSuggestion ? 60 : 100).strength(0.5))
    //     .force("y", d3.forceY((d: any) => 100).strength(d => d.isSuggestion ? 0 : .5))// d.isSuggestion? d.y: 0))
    //     .force("x", d3.forceX((d: any) => d.x).strength(d => d.isSuggestion ? 0 : .5))

    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Append rectangle to container
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('stroke', '#ccc');

    // Init progress bar
    const progressBar = g.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', 'red')
      .style('stroke-width', '2');

    // Linear scale for progress bar
    const scale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth]);

      const worker = new Worker('histWorker.js');

      // Post data to worker
    worker.postMessage({
      height: innerHeight,
      links: this.links,
      nodes: this.nodes,
      width: innerWidth,
    });

    worker.onmessage = (event) => {
      switch (event.data.type) {
        case 'tick': return ticked(event.data);
        case 'end': return ended(event.data);
      }
    };

    // tslint:disable-next-line:no-shadowed-variable
    const ticked = (data: any) => {
      progressBar.transition().duration(10)
        .attr('x2', scale(data.progress));
    }

    // tslint:disable-next-line:no-shadowed-variable
    const ended = (data: any) => {
      progressBar.remove();

      const links = data.links;
      const nodes = data.nodes;

      g.append('g')
        .attr('class', 'links')
        .attr('transform', 'translate(' + (innerWidth / 2) + ',' + (innerHeight / 10) + ')')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .style('stroke', '#1890ff')
        .style('stroke-opacity', 0.6)
        .style('stroke-width', (d: any) => Math.sqrt(d.value) * 2)
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      const node = g.append('g')
        .attr('class', 'nodes')
        .attr('transform', 'translate(' + (innerWidth / 2) + ',' + (innerHeight / 10) + ')')
        .selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        node.append<SVGCircleElement>('circle')
            .attr('r', (d: any) => d.isSuggestion ? 20 : 60)
            .style('stroke', (d: any) => d.isSuggestion ? "#E8F7FB" : 'rgb(246, 93, 93)')
            .style('stroke-width', 4)
            .style('fill', (d: any) => d.isSuggestion ? "#E8F7FB" : "rgb(246, 93, 93)")

      node.on('click', (d: any) => {
        this.props.loadPreview(d.data.url);
      })

        node.append("text")
        .attr("dx", (d: any) => d.isSuggestion ? -25 : -40)
        .attr("dy", ".35em")
        .attr("fill", (d: any) => d.isSuggestion ? "rgb(246, 93, 93)" : "white")
        .text((d: any) => d.data.title)
        .style("font-family", "Avenir")
        .style("font-size", (d: any) => d.isSuggestion ? "10px" : "16px");  

    }

    
}

  

  private loadHistory = () => {
    const response = this.historyGraph.generateGraph();
    console.log({response});
    const nodes = response.nodes;
    const links = response.links;
    this.nodes = Object.keys(nodes).map(id => nodes[id]);
    const nonSugNodes = Object.keys(nodes).map((key: any) => nodes[key]).filter((node: any) => !node.isSuggestion).length;
    Object.keys(nodes).forEach((n: any) => nodes[n].x += this.props.width - (this.props.width * (1 / (nonSugNodes === 1 ? 2 : nonSugNodes))));
    this.links = links.map((link: any) => ({ source: nodes[link.source], target: nodes[link.target] }));
    this.loadGraph();
  }
}