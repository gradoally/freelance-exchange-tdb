import { Address, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const master = provider.open(
        Master.createFromConfig(
            {
                ownerAddress: provider.sender().address as Address,
            },
            await compile('Master')
        )
    );

    await master.sendDeploy(provider.sender(), toNano('0.05'));
}