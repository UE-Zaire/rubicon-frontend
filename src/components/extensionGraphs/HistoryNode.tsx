import GraphLink from './GraphLink';
import Page from './page';
import SuggestionNode from './SuggestionNode';

class HistoryNode {
    public page: Page;
    public prev: HistoryNode | null;
    public next: HistoryNode | null = null;
    public suggestions: SuggestionNode[];
    public isSuggestion: boolean = false;
    public id: number;

    constructor(page: Page, prev: HistoryNode | null, id: number) {
        this.page = page;
        this.prev = prev;
        this.id = id;
        this.suggestions = [];
    }

    public getLink(): GraphLink | null {
        if (this.prev === null) {
            return null;
        }
        return {
            source: this.prev.id,
            target: this.id
        }
    }
}

export default HistoryNode