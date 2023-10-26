import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton-community/sandbox';
import { Address, Cell, Dictionary, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { buildNftCollectionDataCell } from '../wrappers/utils/collectionHelpers';
import { AdminCollection } from '../wrappers/AdminCollection';
import { buildOrderOnchainMetadata } from '../wrappers/utils/build_data';

describe('Master', () => {

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin_wallet: SandboxContract<TreasuryContract>;
    let first_user_wallet: SandboxContract<TreasuryContract>;
    let second_user_wallet: SandboxContract<TreasuryContract>;
    let master: SandboxContract<Master>;

    beforeAll(async () => {

        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        admin_wallet = await blockchain.treasury('admin_wallet');
        first_user_wallet = await blockchain.treasury('first_user_wallet');
        second_user_wallet = await blockchain.treasury('second_user_wallet');

        master = blockchain.openContract(
            Master.createFromConfig({
                ownerAddress: deployer.address,
                nextCollectionIndex: 0,
            }, 
            await compile('Master'))
        );

        const deployResult = await master.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: master.address,
            deploy: true,
        });

        await blockchain.setVerbosityForAddress(master.address, {
            print: true,
            blockchainLogs: false,
            debugLogs: false,
            vmLogs: 'vm_logs'
        });

        // Deploy admins collection (first)

        const adminCollectionDataCell = buildNftCollectionDataCell({
            collectionName: 'Admins Collection',
            collectionDescription: 'Admins Collection with onchain metadata',
            collectionImageUrl: 'https://tonbyte.com/gateway/B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/collection.jpg',
            ownerAddress: master.address,
            nextItemIndex: 0,
            commonContent: '',
            nftItemCode: await compile('AdminNft'),
            royaltyParams: {
                royaltyFactor: 12,
                royaltyBase: 100,
                royaltyAddress: master.address
            }
        });

        const deployAdminCollectionResult = await master.sendDeployCollection(deployer.getSender(), {
            collectionCode: await compile('AdminCollection'),
            collectionData: adminCollectionDataCell,
        });
        
        expect(deployAdminCollectionResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

        expect(deployAdminCollectionResult.transactions).toHaveTransaction({
            from: master.address,
            success: true,
            deploy: true,
        });
        
        const firstNextCollectionIndex = (await blockchain.getContract(master.address)).get('get_master_data').stackReader.skip(1).readNumber();
        
        expect(firstNextCollectionIndex).toEqual(1);

        // Deploy user's collection (second)

        const userCollectionDataCell = buildNftCollectionDataCell({
            collectionName: 'Users Collection',
            collectionDescription: 'Users Collection with onchain metadata',
            collectionImageUrl: 'https://tonbyte.com/gateway/B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/collection.jpg',
            ownerAddress: master.address,
            nextItemIndex: 0,
            commonContent: '',
            nftItemCode: await compile('UserNft'),
            royaltyParams: {
                royaltyFactor: 12,
                royaltyBase: 100,
                royaltyAddress: master.address
            }
        });
        
        const deployUserCollectionResult = await master.sendDeployCollection(deployer.getSender(), {
            collectionCode: await compile('UserCollection'),
            collectionData: userCollectionDataCell,
        });
        
        expect(deployUserCollectionResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

        expect(deployUserCollectionResult.transactions).toHaveTransaction({
            from: master.address,
            success: true,
            deploy: true,
        });

        const secondNextCollectionIndex = (await blockchain.getContract(master.address)).get('get_master_data').stackReader.skip(1).readNumber();

        expect(secondNextCollectionIndex).toEqual(2);

        // Deploy orders collection (third)

        const ordersollectionDataCell = buildNftCollectionDataCell({
            collectionName: 'Orders Collection',
            collectionDescription: 'Orders Collection with onchain metadata',
            collectionImageUrl: 'https://tonbyte.com/gateway/B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/collection.jpg',
            ownerAddress: master.address,
            nextItemIndex: 0,
            commonContent: '',
            nftItemCode: await compile('OrderNft'),
            royaltyParams: {
                royaltyFactor: 12,
                royaltyBase: 100,
                royaltyAddress: master.address
            }
        });
        
        const deployOrdersCollectionResult = await master.sendDeployCollection(deployer.getSender(), {
            collectionCode: await compile('OrderCollection'),
            collectionData: ordersollectionDataCell,
        });
        
        expect(deployOrdersCollectionResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

        expect(deployOrdersCollectionResult.transactions).toHaveTransaction({
            from: master.address,
            success: true,
            deploy: true,
        });
        
        const thirdNextCollectionIndex = (await blockchain.getContract(master.address)).get('get_master_data').stackReader.skip(1).readNumber();
        
        expect(thirdNextCollectionIndex).toEqual(3);

        console.log('Master address: ' + master.address);

        printTransactionFees(deployAdminCollectionResult.transactions);
        printTransactionFees(deployUserCollectionResult.transactions);
        printTransactionFees(deployOrdersCollectionResult.transactions);

    });

    beforeEach(async () => {

    });

    it('should deploy user', async () => {

    });

    it('user should deploy order', async () => {

        const deployOrderResult = await master.sendDeployItem(first_user_wallet.getSender(), {
            itemIndex: 0,
            itemOwnerAddress: admin_wallet.address,
            metadataDict: buildOrderOnchainMetadata({
                name: 'Some Order',
                description: 'Some Order Desription',
                image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
                status: 'On Moderation',
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

        expect(deployOrderResult.transactions).toHaveTransaction({
            from: first_user_wallet.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

        expect(deployOrderResult.transactions).toHaveTransaction({
            from: master.address,
            success: true
        });

    });

    it('admin should activate an order', async () => {

    });

    it('freelancer should send responce to order', async () => {

    });

    it('customer should choose executor of order', async () => {

    });

    it('freelancer should send notification of order completion', async () => {

    });

    it('customer should initiate arbitration', async () => {

    });

    it('admin should decide on arbitration', async () => {

    });

    it('customer should approve completion of order', async () => {

    });

});


