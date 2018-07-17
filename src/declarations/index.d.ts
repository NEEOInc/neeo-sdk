declare module 'tokensearch.js' {
  class TokenSearch<T = any> {
    constructor(items: T[], options: TokenSearch.Options);

    search(query: string): T[];
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
  isFinite<T>(n: number | T): n is number;
}
