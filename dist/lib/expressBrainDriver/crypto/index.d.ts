import * as express from 'express';
export { generateKey, getPublicKey, decrypt, encrypt, generateDecryptMiddleware, };
declare function generateKey(): any;
declare function getPublicKey(): any;
declare function decrypt(cipher: string): Promise<string>;
declare function encrypt(plainText: string): Promise<string>;
declare function generateDecryptMiddleware(decryptFunction: (str: string) => Promise<string>): express.RequestHandler;
