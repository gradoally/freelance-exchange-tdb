import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type UserNftConfig = {};

export function userNftConfigToCell(config: UserNftConfig): Cell {
    return beginCell().endCell();
}

export class UserNft implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new UserNft(address);
    }

    static createFromConfig(config: UserNftConfig, code: Cell, workchain = 0) {
        const data = userNftConfigToCell(config);
        const init = { code, data };
        return new UserNft(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
