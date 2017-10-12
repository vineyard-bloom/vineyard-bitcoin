
import {BlockService} from "./types";

// export class StandardBlockService implements BlockService{
//     bitcoinCollection:Collection<any>
//
//     getLastBlock(): Promise<string> {
//         return this.bitcoinCollection.first_or_null()
//           .then(record => record ? record.lastblock : '')
//     }
//
//     setLastBlock(value: string): Promise<void> {
//         return this.bitcoinCollection.first_or_null()
//           .then(record => record
//             ? this.bitcoinCollection.update(record, {lastblock: value})
//             : this.bitcoinCollection.create({lastblock: value}))
//     }
// }