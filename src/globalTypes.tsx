export interface IData {
  links: Array<{ source: string; target: string; value: number }>;
  nodes: Array<{ id: string; group: number }>
}

export interface IGlobalState {
  collapsed: boolean;
  platform: string;
  forceData: IData | null;
  height: number;
  renderChild: boolean;
  autoComp: AutoCompData;
  search: string;
  width: number;
}

export interface ICrumbProps {
  view: string;
}

export interface IForceProps {
  width: number;
  height: number;
  data: IData;
  handleEv: () => void;
}

export interface IHeadProps {
  collapsed: boolean;
  toggleSider: () => void;
  suggestions: object;
  input: string;
  ctrlInput: (e: any) => void;
  ctrlSelect: (value: string ) => void;
  view: string;
  postWiki: () => void;
}

export interface INavProps {
  collapsed: boolean;
  select: (e: any) => void;
  view: string;
}

export interface IAutoCompDatum{
  id: string; 
  label: string;
}

export type AutoCompData = IAutoCompDatum[];
