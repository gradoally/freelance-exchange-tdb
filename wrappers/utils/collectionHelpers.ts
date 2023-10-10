import {Address, Cell, beginCell, Dictionary} from "ton-core";
import crypto from 'crypto';

function sha256Hash(input: string): bigint {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    const hashBuffer = hash.digest();
    const hashHex = hashBuffer.toString('hex');
    const numericHash = BigInt('0x' + hashHex);
    return numericHash;
}

export type RoyaltyParams = {
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
};

export type NftCollectionData = {
    collectionName: string;
    collectionDescription: string;
    collectionImageUrl: string;
    ownerAddress: Address;
    nextItemIndex: number | bigint;
    commonContent: string;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
};

export function buildNftCollectionDataCell(data: NftCollectionData): Cell {
    const dict = Dictionary.empty<bigint, Cell>();
    dict.set(sha256Hash('name'),
        beginCell().storeUint(0, 8).storeStringTail(data.collectionName).endCell()
    );
    dict.set(sha256Hash('description'),
        beginCell().storeUint(0, 8).storeStringTail(data.collectionDescription).endCell()
    );
    dict.set(sha256Hash('image'),
        beginCell().storeUint(0, 8).storeStringTail(data.collectionImageUrl).endCell()
    );

    const collectionContent = beginCell()
        .storeUint(0, 8)
        .storeDict(dict, Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())
        .endCell()
    const nftCommonContent = beginCell().endCell();

    const contentCell = beginCell()
        .storeRef(collectionContent)
        .storeRef(nftCommonContent)
        .endCell();

    const royaltyCell = beginCell()
        .storeUint(data.royaltyParams.royaltyFactor, 16)
        .storeUint(data.royaltyParams.royaltyBase, 16)
        .storeAddress(data.royaltyParams.royaltyAddress)
        .endCell();

    const collectionData = beginCell()
        .storeAddress(data.ownerAddress)
        .storeUint(data.nextItemIndex, 64)
        .storeRef(contentCell)
        .storeRef(data.nftItemCode)
        .storeRef(royaltyCell)
        .endCell();

    return collectionData;
}