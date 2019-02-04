import * as Models from '../../models';
export default class implements Models.ListBuilder {
    readonly items: Models.ListItem[];
    _meta: Models.ListMetadata;
    title: string;
    private limit;
    private offset;
    private totalMatchingItems;
    private browseIdentifier?;
    constructor({ title, limit, offset, totalMatchingItems, browseIdentifier, }?: Models.ListParameters);
    setListTitle(name: string): this;
    setTotalMatchingItems(totalMatchingItems: number): this;
    addListItem(params: Models.ListItemParameters, updateList?: boolean): this;
    addListItems(rawItems: ReadonlyArray<Models.ListItemParameters>): this;
    addListHeader(title: string): this;
    addListTiles(params: ReadonlyArray<Models.ListTileParameters>): this;
    addListInfoItem(params: Models.ListInfoItemParameters): this;
    addListButtons(params: ReadonlyArray<Models.ListButtonParameters>): this;
    private prepareItemsAccordingToOffsetAndLimit;
    private build;
    private buildMetadata;
    private verifyFullList;
}
