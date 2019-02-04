declare class TokenSearch<T = any> {
  constructor(items: T[], options: TokenSearchOptions);

  public search(query: string): T[];
}

declare interface TokenSearchOptions {
  unique: boolean;
  delimiter: string;
  collectionKeys: string[];
  threshold: number;
}
