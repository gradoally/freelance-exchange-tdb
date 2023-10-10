import { Address } from 'ton-core';
import { Master } from '../wrappers/Master';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {

    const masterAddress = Address.parse('');

    const master = provider.open(Master.createFromAddress(masterAddress));

    await master.sendDestroySbt(provider.sender(), {
        itemAddress: Address.parse('')
    });
}