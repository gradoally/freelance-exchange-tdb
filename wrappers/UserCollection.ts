import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type UserCollectionConfig = {
    ownerAddress: Address;
    nextItemIndex: number | bigint;
    content: Cell;
    nftItemCode: Cell;
    royaltyParams: Cell;
};

export function userCollectionConfigToCell(config: UserCollectionConfig): Cell {
    return beginCell()
        .storeAddress(config.ownerAddress)
        .storeUint(config.nextItemIndex, 64)
        .storeRef(config.content)
        .storeRef(config.nftItemCode)
        .storeRef(config.royaltyParams)
    .endCell();
}

export class UserCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new UserCollection(address);
    }

    static createFromConfig(config: UserCollectionConfig, code: Cell, workchain = 0) {
        const data = userCollectionConfigToCell(config);
        const init = { code, data };
        return new UserCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
