import { Address, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {

    const masterAddress = Address.parse('');

    const master = provider.open(Master.createFromAddress(masterAddress));

    await master.sendTransferItem(provider.sender(), {
        fwdAmount: toNano('0.5'),
        newOwner: Address.parse(''),
        responseAddress: provider.sender().address as Address,
        itemAddress: Address.parse('')
    });
}