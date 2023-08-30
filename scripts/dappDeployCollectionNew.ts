import { NftDapp } from '../wrappers/NftDapp';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { Address } from 'ton-core';
import { buildNftCollectionDataCell } from '../wrappers/utils/collectionHelpers';
import { sleep } from '@ton-community/blueprint/dist/utils';
import { randomAddress } from '@ton-community/test-utils';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const dappAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Dapp address'));

    const nftDapp = provider.open(NftDapp.createFromAddress(dappAddress));

    const collectionDataCell = buildNftCollectionDataCell({
        collectionContent: '',
        ownerAddress: dappAddress,
        nextItemIndex: 0,
        commonContent: '',
        nftItemCode: await compile('OrderNft'),
        royaltyParams: {
            royaltyFactor: 12,
            royaltyBase: 100,
            royaltyAddress: dappAddress
        }
  });

    await nftDapp.sendDeployCollectionMsg(provider.sender(), {
        collectionCode: await compile('OrderCollection'),
        collectionData: collectionDataCell,
        queryId: 0,
    });

    sleep(3500);

    ui.write("Collection deployed!");
}

