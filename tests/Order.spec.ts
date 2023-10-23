import { Blockchain, SandboxContract, printTransactionFees } from '@ton-community/sandbox';
import { Cell, Dictionary, beginCell, toNano } from 'ton-core';
import { OrderNft } from '../wrappers/OrderNft';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { buildOrderOnchainMetadata } from '../wrappers/utils/build_data';

describe('OrderNft', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('OrderNft');
    });

    let blockchain: Blockchain;
    let orderNft: SandboxContract<OrderNft>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const master = await blockchain.treasury('master');
        const orderCollection = await blockchain.treasury('orderCollection');

        const metadataDict = buildOrderOnchainMetadata({
            name: 'Some Order',
            description: 'Some Order Desription',
            image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
            status: 'On moderation',
            amount: '1000',
            technical_assignment: 'https://whales.infura-ipfs.io/ipfs/QmQ5QiuLBEmDdQmdWcEEh2rsW53KWahc63xmPVBUSp4teG/3880.png',
            starting_unix_time: 1692831600,
            ending_unix_time: 1692831600,
            creation_unix_time: 1692831600,
            category: 'Блокчейн TON',
            customer_addr: 'EQDWfTV0XtuUrRYF8BqOm1U2yr3axYlpvxxnGXyx2nwIypM3',
            freelancer_addr: ''
        });

        const content = beginCell()
            .storeDict(metadataDict, Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())
        .endCell()

        orderNft = blockchain.openContract(OrderNft.createFromConfig({
            index: 0,
            collectionAddress: orderCollection.address,
            ownerAddress: master.address,
            editorAddress: master.address,
            content: content
        }, await compile('OrderNft')));

        const deployOrderResult = await orderNft.sendDeploy(orderCollection.getSender(), toNano('0.05'));

        expect(deployOrderResult.transactions).toHaveTransaction({
            from: orderCollection.address,
            to: orderNft.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and orderNft are ready to use
    });

    it('should change order status', async () => {
        const master = await blockchain.treasury('master');

        // await blockchain.setVerbosityForAddress(orderNft.address, {
        //     vmLogs: 'vm_logs_full',
        //     print: true,
        //     blockchainLogs: false,
        //     debugLogs: false
        // })

        const res = await orderNft.sendChangeStatusFromModerationToActive(master.getSender());

        printTransactionFees(res.transactions)
    })
});
