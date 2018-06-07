export interface IData {
  links: Array<{ source: string; target: string; value: number }>;
  nodes: Array<{ id: string; group: number }>
}

export interface IAppRouterState {
  auth: boolean;
  userInfo: IUserInfo | null;
}

export interface IGlobalState {
  autoComp: AutoCompData;
  collapsed: boolean;
  fallbackWidth: number;
  forceData: IData | null;
  height: number;
  histories: any;
  preview: IPreview | null;
  renderDynamic: number | null;
  search: string;
  searchH1: string;
  searchLoading: boolean;
  searchRes: any[];
  userInfo: IUserInfo | null;
  width: number;
  view: string;
}

export interface IHeadState {
  search: string;
}

export interface IDashProps {
  logOut: () => void;
  userInfo: IUserInfo | null;
}

export interface ICrumbProps {
  preview: IPreview | null; 
  search: string;
  view: string;
}

export interface IForceProps {
  width: number;
  height: number;
  data: IData;
  view: string;
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
  postGoog: () => void;
  logOut: () => void;
  menuClick: (e: any) => void;
  userInfo: IUserInfo | null;
}

export interface IHistGraphProps {
  height: number;
  width: number;
  history: any;
  user?: any;
}


export interface INavProps {
  collapsed: boolean;
  select: (e: any) => void;
  view: string;
}

export interface IPreviewProps extends IPreview{
  removePreview: () => void;
}

export interface IStaticHistProps extends IHistGraphProps{
  loadPreview: (e: any) => void;
}

export interface IAutoCompDatum{
  id: string; 
  label: string;
}

export interface IPreview{
  name: string;
  lookup: string;
  x: number;
  y: number;
  searchType: string;
}

export interface IUserInfo {
  name: string;
  profPic: string;
} 

export type AutoCompData = IAutoCompDatum[];

