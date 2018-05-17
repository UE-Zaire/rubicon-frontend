// import Page from './page'

// class HistoryGraph {
//     public linearHistory: string[];
//     public allPages: {[pageId: string]: Page};

//     constructor() {
//         this.allPages = {};
//         this.linearHistory = [];
//     }

//     // removes page from history but keeps its data
//     public deletePageFromHistory(pageId: string) {
//         delete this.linearHistory[this.linearHistory.indexOf(pageId)];
//     }

//     public addPage(newPage: Page): void {
//         this.allPages[newPage.id] = newPage;
//         this.linearHistory.push(newPage.id);
//     }

//     // public getNodes(): HistoryGraphNode[] {
//     //     const nodes: HistoryGraphNode[] = [];
//     //     for (const pageId of this.linearHistory) {
//     //         const page: Page = this.allPages[pageId];
//     //         // const pageNode: HistoryGraphNode = {
//     //         //     data: {},
//     //         //     index: nodes.length,
//     //         //     next: null,
//     //         //     suggestions: page.suggestions,
//     //         //     vx: 0,
//     //         //     vy: 0,
//     //         //     x: -200 + 20 * nodes.length,
//     //         //     y: 0,
//     //         // }
//     //         for (const suggestionId of page.suggestions) {
//     //             const suggestion = this.allPages[suggestionId];
//     //             const suggestionNode: HistoryGraphNode = {
//     //                 data: {},
//     //                 index: nodes.length,
//     //                 next: null,
//     //                 suggestions: [],
//     //                 vx: 0,
//     //                 vy: 0,
//     //                 x: -200 + 20 * nodes.length,
//     //                 y: 0,
//     //             }
//     //             nodes.push();
//     //         }
//     //     }
//     //     return nodes;
//     // }
// }

// export default HistoryGraph;
