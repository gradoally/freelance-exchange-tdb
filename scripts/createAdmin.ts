import { Master } from '../wrappers/Master';
import { NetworkProvider } from '@ton-community/blueprint';
import { Address } from 'ton-core';
import { buildAdminOnchainMetadata } from '../wrappers/utils/build_data';
import { Opcodes } from '../wrappers/utils/opCodes';

export async function run(provider: NetworkProvider, args: string[]) {
    const masterAddress = Address.parse('');

    const master = provider.open(Master.createFromAddress(masterAddress));

    await master.sendDeployItem(provider.sender(), {
        op: Opcodes.createAdmin,
        itemIndex: 0,
        itemOwnerAddress: provider.sender().address as Address,
        metadataDict: buildAdminOnchainMetadata({
            name: 'Admin 1',
            description: '',
            image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
            telegram: '@motherfucker007'
        })
    });
}

