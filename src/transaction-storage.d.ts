import { BlockService } from "./types";
import { Collection } from "vineyard-ground";
export declare class StandardBlockService implements BlockService {
    bitcoinCollection: Collection<any>;
    getLastBlock(): Promise<string>;
    setLastBlock(value: string): Promise<void>;
}
