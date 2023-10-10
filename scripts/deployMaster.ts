import { Address, Dictionary, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const master = Master.createFromConfig(
        {
            ownerAddress: provider.sender().address as Address,
            nextCollectionIndex: 0,
            collectionsDict: Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Address()),
        },

        await compile('Master')
    );

    await provider.deploy(master, toNano('0.05'));
}