export interface IData {
  links: Array<{ source: string; target: string; value: number }>;
  nodes: Array<{ id: string; group: number }>
}

export interface IGlobalState {
  autoComp: AutoCompData;
  collapsed: boolean;
  forceData: IData | null;
  height: number;
  platform: string;
  preview: IPreview | null;
  renderChild: boolean;
  search: string;
  width: number;
  view: string;
}

export interface IAuthProps {
  logIn: () => void;
}

export interface IDashProps {
  logOut: () => void;
}

export interface ICrumbProps {
  view: string;
}

export interface IForceProps {
  width: number;
  height: number;
  data: IData;
  handleEv: () => void;
  loadPreview: (e: any) => void;
  removePreview: () => void;
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
  logOut: () => void;
  menuClick: (e: any) => void;
}

export interface INavProps {
  collapsed: boolean;
  select: (e: any) => void;
  view: string;
}

export interface IPreviewProps extends IPreview{
  removePreview: () => void;
}

export interface IAutoCompDatum{
  id: string; 
  label: string;
}

export interface IPreview{
  lookup: string;
  x: number;
  y: number; 
}

export type AutoCompData = IAutoCompDatum[];
