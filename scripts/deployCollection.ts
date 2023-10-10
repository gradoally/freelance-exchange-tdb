import { Master } from '../wrappers/Master';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { Address } from 'ton-core';
import { buildNftCollectionDataCell } from '../wrappers/utils/collectionHelpers';

export async function run(provider: NetworkProvider, args: string[]) {

    const masterAddress = Address.parse('');

    const master = provider.open(Master.createFromAddress(masterAddress));

    const collectionDataCell = buildNftCollectionDataCell({
        collectionName: 'Admin Collection with onchain',
        collectionDescription: 'onchain meta onchain meta',
        collectionImageUrl: 'https://tonbyte.com/gateway/B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/collection.jpg',
        ownerAddress: masterAddress,
        nextItemIndex: 0,
        commonContent: '',
        nftItemCode: await compile('AdminNft'),
        royaltyParams: {
            royaltyFactor: 12,
            royaltyBase: 100,
            royaltyAddress: provider.sender().address as Address
        }
    });

    await master.sendDeployCollection(provider.sender(), {
        collectionCode: await compile('AdminCollection'),
        collectionData: collectionDataCell,
    });
}

