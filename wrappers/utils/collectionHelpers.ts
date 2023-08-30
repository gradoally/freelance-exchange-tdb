import {Address, Cell, beginCell, Dictionary} from "ton-core";
import { ItemMetaDataKeys, buildOnChainMetadataCell, encodeOffChainContent } from "./nftContent";
import crypto from 'crypto';

export type RoyaltyParams = {
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
};

export type NftCollectionData = {
    collectionContent: string;
    ownerAddress: Address;
    nextItemIndex: number | bigint;
    commonContent: string;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
};

export function buildNftCollectionDataCell(data: NftCollectionData): Cell {
    const collectionContent = beginCell()
        .storeUint(1, 8)
        .storeStringTail(data.collectionContent)
        .endCell()

    let nftCommonContent;
    if(data.commonContent == '') {
        nftCommonContent = beginCell().endCell();
    } else {
        nftCommonContent = beginCell().storeStringTail(data.commonContent).endCell();
    }

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