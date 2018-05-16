/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import { Component } from 'react';
import { IForceProps } from '../globalTypes';

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}

export default class ForceGraph extends Component<IForceProps> {
  
  private ctrls: IRefs = {};
  private force: any;
  
  public componentDidMount() {
    this.renderForce();
  }
  
  public componentDidUpdate() {
    console.log(' shouldupdating component')
      this.removeForce();
      this.renderForce();
  }
  
  public shouldComponentUpdate(nextProps: IForceProps) {
  
    return JSON.stringify(this.props) === JSON.stringify(nextProps) ? false : true;
  }
  
  public render() {
    const { width, height } = this.props;
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

  
  private removeForce() {
    const force: any = this.ctrls.mountPoint;
    
    while(force.hasChildNodes()) {
      force.removeChild(force.lastChild);
    }
  }
  
  private renderForce() {
    const { width, height, data } = this.props;
    console.log('rendering de Force', data);
    const radius: number = data.nodes.length > 500 ? 40 * 300/data.nodes.length : height > 1800 ? 44 : 30;
    
    if (this.ctrls.mountPoint !== undefined) {

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

      const link = svg
        .append("g")
        .attr("class", "links")
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .style('stroke', '#1890ff')
        .style('stroke-opacity', 0.6)
        .style('stroke-width', d => Math.sqrt(d.value) * 2)


      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const node = svg
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append<SVGCircleElement>('circle')
        .attr('r', radius)
        .style('stroke', '#FFFFFF')
        .style('stroke-width', 2)
        .style('fill', (d: any) => color(d.group))
        .call(
          d3
            .drag()
            .on('start', ((d: SimulationNodeDatum) => this.dragStarted(d, this.force)))
            .on('drag', this.dragged)
            .on('end', ((d: SimulationNodeDatum) => this.dragEnded(d, this.force))),
      )

      const labels = svg.selectAll(".mytext")
            .data(data.nodes)
            .enter()
            .append("text")
              .text((d: any) => d.id )
              .style("text-anchor", "middle")
              .style("fill", "white")
              .style("font-family", "Arial")
              .style("font-size", 12)
              .on("click", this.props.handleEv)

      this.force.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        // node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
        node.attr("cx", (d: any) => d.x = Math.max(radius, Math.min(width - radius, d.x)))
        .attr("cy", (d: any) => d.y = Math.max(radius, Math.min(height - radius, d.y)));

        labels
          .attr("x", (d: any) => d.x )
          .attr("y", (d: any) => d.y);
      });
    }
  }
  private dragStarted(d: SimulationNodeDatum, force: any) {
    if (!d3.event.active) {
      force.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(d: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragEnded(d: any, force: any) {
    if (!d3.event.active) { force.alphaTarget(0)};
    // d.fx = null;
    // d.fy = null;
  }

}