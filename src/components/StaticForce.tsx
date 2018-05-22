/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
// import { SimulationNodeDatum } from 'd3';
// import { debounce } from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import { IData } from '../globalTypes';

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}


const height = 560;
const width = 960;
const margin = { top: 30, bottom: 30, left: 30, right: 30 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export default class StaticGraph extends Component<{data: IData | null}, {}> {
  public force: any;
  private ctrls: IRefs = {};

  public componentDidMount() {
    this.renderStaticGraph();
  }

  public render() {
    const style = {
      backgroundColor: 'rgb(255, 255, 255)',
      height,
      width
    };

    return (
      <div>
        <div style={style} ref={mountPoint => (this.ctrls.mountPoint = mountPoint)} />
      </div>)
  }

  public renderStaticGraph = () => {

    const { data } = this.props;

    if (this.ctrls.mountPoint !== undefined && data !== null) {

      this.force = d3
        .forceSimulation()
        .nodes(data.nodes)
        .force(
          'charge',
          d3
            .forceManyBody()
            .strength(
              data.nodes.length > 500 ? -200 :
                data.nodes.length > 100 ? -1400 :
                  height > 1800 ? (data.nodes.length > 60 ? -3000 : data.nodes.length > 30 ? -4000 : -10000) :
                    -3200))
        .force("link", d3.forceLink(data.links).id((d: any) => d.id))
        .force('center', d3.forceCenter(width / 2, height / 2.2));

      const svg = d3
        .select(this.ctrls.mountPoint)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create container of force simulation

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

      // Read data
      // Init worker
      const worker = new Worker('worker.js');

      // Post data to worker
      worker.postMessage({
        height: innerHeight,
        links: data.links,
        nodes: data.nodes,
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
        // Remove progress bar when finished
        progressBar.remove();

        // Get data with x and y values
        const links = data.links;
        const nodes = data.nodes;

        // Add links
        g.append('g')
          .attr('class', 'links')
          .attr('transform', 'translate(' + (innerWidth / 2) + ',' + (innerHeight / 2) + ')')
          .selectAll('line')
          .data(links)
          .enter().append('line')
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        // Add nodes
        const node = g.append('g')
          .attr('class', 'nodes')
          .attr('transform', 'translate(' + (innerWidth / 2) + ',' + (innerHeight / 2) + ')')
          .selectAll('.node')
          .data(nodes)
          .enter().append('g')
          .attr('class', 'node')
          .attr('transform', (d: any) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          });

        // Add circles to nodes
        node.append('circle')
          .attr('cy', '0')
          .attr('cx', '0')
          .attr('r', 5)
          .attr('fill', 'steelblue');
      }

    }

  }
}