import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, toNano } from 'ton-core';
import { crc32 } from './utils/crc32';

export type OrderNftConfig = {
    index: number;
    collectionAddress: Address;
    ownerAddress: Address;
    content: Cell;
    editorAddress: Address;
};

export function orderNftConfigToCell(config: OrderNftConfig): Cell {
    return beginCell()
            .storeUint(config.index, 64)
            .storeAddress(config.collectionAddress)
            .storeAddress(config.ownerAddress)
            .storeRef(config.content)
            .storeAddress(config.editorAddress)
            .storeDict(Dictionary.empty())
        .endCell();
}

export class OrderNft implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    private readonly CHANGE_STATUS_FROM_MODERATION_TO_ACTIVE = crc32('op::change_status_from_moderation_to_active');

    static createFromAddress(address: Address) {
        return new OrderNft(address);
    }

    static createFromConfig(config: OrderNftConfig, code: Cell, workchain = 0) {
        const data = orderNftConfigToCell(config);
        const init = { code, data };
        return new OrderNft(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTransfer(provider: ContractProvider, via: Sender,
        opts: {
            newOwner: Address;
            responseAddress?: Address;
            fwdAmount?: bigint;
        }
    ) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x5fcc3d14, 32)
                .storeUint(0, 64)
                .storeAddress(opts.newOwner)
                .storeAddress(opts.responseAddress || null)
                .storeBit(false) // no custom payload
                .storeCoins(opts.fwdAmount || 0)
                .storeBit(false) // no forward payload
            .endCell(),
        });
    }

    async sendChangeStatusFromModerationToActive(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(this.CHANGE_STATUS_FROM_MODERATION_TO_ACTIVE, 32)
                .storeUint(0, 64)
            .endCell(),
        });
    }
}
