declare module 'tokensearch.js' {
  class TokenSearch<T = any> {
    constructor(items: T[], options: TokenSearch.Options);

    public search(query: string): T[];
  }

  namespace TokenSearch {
    export interface Options {
      unique: boolean;
      delimiter: string;
      collectionKeys: string[];
      threshold: number;
    }
  }

  export = TokenSearch;
}

declare class NumberConstructor {
  public isFinite<T>(n: number | T): n is number;
}
