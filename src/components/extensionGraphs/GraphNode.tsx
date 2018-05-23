import {SimulationNodeDatum} from 'd3';
import Page from './page';

class GraphNode implements SimulationNodeDatum {
  public data: Page;
  public prevId: number | null;
  public anchorId: number | null;
  public isSuggestion: boolean;
  public id: number;
  public index: number;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
}

export default GraphNode