import GraphLink from './GraphLink';
import HistoryNode from './HistoryNode';
import Page from './page';

class SuggestionNode {
    public page: Page;
    public anchor: HistoryNode;
    public isSuggestion: boolean = true;
    public id: number;

    constructor(page: Page, anchor: HistoryNode, id: number) {
        this.page = page;
        this.anchor = anchor;
        this.id = id;
    }

    public getLink(): GraphLink {
        return {
            source: this.anchor.id,
            target: this.id
        }
    }
}

export default SuggestionNode
