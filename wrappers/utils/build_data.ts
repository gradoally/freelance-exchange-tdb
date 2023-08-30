import { beginCell, Cell, Address } from "ton";
import { Dictionary } from "ton-core";
import { sha256_sync } from "ton-crypto"
import crypto from "crypto";


const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

function sha256Hash(input: string): bigint {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    const hashBuffer = hash.digest();
    const hashHex = hashBuffer.toString('hex');
    const numericHash = BigInt('0x' + hashHex);
    return numericHash;
}

export function buildOnchainMetadata(data: {
    name: string;
    description: string;
    image: string;
    status: string;
    amount: string;
    technical_assigment: string;
    starting_unix_time: string;
    ending_unix_time: string;
    creation_unix_time: string;
    category: string;
    customer_addr: string;
}): Dictionary<bigint, Cell> {
    let dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    );

    data.description = `${data.description}

test: 1
test: 2
test: 3
`

    Object.entries(data).forEach(([key, value]) => {
        dict.set(sha256Hash(key), beginCell()
            .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
            .storeStringTail(value)
            .endCell());
    });

    return dict;
}