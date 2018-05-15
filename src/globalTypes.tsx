export interface IData {
  links: Array<{ source: string; target: string; value: number }>;
  nodes: Array<{ id: string; group: number }>
}

