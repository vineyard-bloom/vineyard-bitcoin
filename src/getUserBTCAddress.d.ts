export declare function getAddress(id: string, xpub: string): any;
export declare class AddressGenerator {
    xpub: string;
    constructor(xpub: string);
    getAddress(id: string): Promise<any>;
}
