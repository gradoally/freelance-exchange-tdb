import { Master } from '../wrappers/Master';
import { NetworkProvider } from '@ton-community/blueprint';
import { Address } from 'ton-core';
import { buildOrderOnchainMetadata } from '../wrappers/utils/build_data';
import { Opcodes } from '../wrappers/utils/opCodes';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const masterAddress = Address.parse('');
  
    const master = provider.open(Master.createFromAddress(masterAddress));

    await master.sendDeployItem(provider.sender(), {
        op: Opcodes.createOrder,
        itemIndex: 0,
        itemOwnerAddress: masterAddress,
        metadataDict: buildOrderOnchainMetadata({
            name: 'Some Order',
            description: 'Some Order Desription',
            image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
            status: 'Active',
            amount: '1000',
            technical_assignment: 'https://whales.infura-ipfs.io/ipfs/QmQ5QiuLBEmDdQmdWcEEh2rsW53KWahc63xmPVBUSp4teG/3880.png',
            starting_unix_time: 1692831600,
                ending_unix_time: 1692831600,
                creation_unix_time: 1692831600,
                category: 'Блокчейн TON',
                customer_addr: 'EQDWfTV0XtuUrRYF8BqOm1U2yr3axYlpvxxnGXyx2nwIypM3',
                freelancer_addr: ''
            })
    });

    ui.write("Order successfully deployed!");
}

