import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from 'ton-core';

export type AdminNftConfig = {
    index: number;
    collectionAddress: Address;
    ownerAddress: Address;
    content: Cell;
    authorityAddress: Address;
    revokedAt: number;
};

export function adminNftConfigToCell(config: AdminNftConfig): Cell {
    return beginCell()
           .storeUint(config.index, 64)
           .storeAddress(config.collectionAddress)
           .storeAddress(config.ownerAddress)
           .storeRef(config.content)
           .storeAddress(config.authorityAddress)
           .storeUint(config.revokedAt, 64)
        .endCell();
}

export class AdminNft implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AdminNft(address);
    }

    static createFromConfig(config: AdminNftConfig, code: Cell, workchain = 0) {
        const data = adminNftConfigToCell(config);
        const init = { code, data };
        return new AdminNft(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendProveOwnership(
        provider: ContractProvider, 
        via: Sender, 
        opts: {
            dest: Address
            forwardPayload?: Cell
            withContent: boolean
        }
    ) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x04ded148, 32)
                .storeUint(0, 64)
                .storeAddress(opts.dest)
                .storeMaybeRef(opts.forwardPayload)
                .storeBit(opts.withContent)
            .endCell()
        });
    }
}
