import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { beginCell, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { buildNftCollectionDataCell } from '../wrappers/utils/collectionHelpers';
import { buildAdminOnchainMetadata, buildOrderOnchainMetadata, buildUserOnchainMetadata } from '../wrappers/utils/build_data';
import { Opcodes } from '../wrappers/utils/opCodes';
import { AdminNft } from '../wrappers/AdminNft';

describe('Master', () => {

    let blockchain: Blockchain;
    let admin: SandboxContract<TreasuryContract>;
    let root: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
    let master: SandboxContract<Master>;

    beforeAll(async () => {

        blockchain = await Blockchain.create();
        root = await blockchain.treasury('root');
        admin = await blockchain.treasury('admin');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');

        master = blockchain.openContract(
            Master.createFromConfig({
                ownerAddress: root.address,
            }, 
            await compile('Master'))
        );

        const deployResult = await master.sendDeploy(root.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: root.address,
            to: master.address,
            deploy: true,
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

        const deployAdminCollectionResult = await master.sendDeployCollection(root.getSender(), {
            collectionCode: await compile('AdminCollection'),
            collectionData: adminCollectionDataCell,
        });
        
        expect(deployAdminCollectionResult.transactions).toHaveTransaction({
            from: root.address,
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
        
        const deployUserCollectionResult = await master.sendDeployCollection(root.getSender(), {
            collectionCode: await compile('UserCollection'),
            collectionData: userCollectionDataCell,
        });
        
        expect(deployUserCollectionResult.transactions).toHaveTransaction({
            from: root.address,
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

        const ordersCollectionDataCell = buildNftCollectionDataCell({
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
        
        const deployOrdersCollectionResult = await master.sendDeployCollection(root.getSender(), {
            collectionCode: await compile('OrderCollection'),
            collectionData: ordersCollectionDataCell,
        });
        
        expect(deployOrdersCollectionResult.transactions).toHaveTransaction({
            from: root.address,
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

        const createAdminResult = await master.sendDeployItem(root.getSender(), {
            op: Opcodes.createAdmin,
            itemIndex: 0,
            itemOwnerAddress: admin.address,
            metadataDict: buildAdminOnchainMetadata({
                name: 'Admin 1',
                description: '',
                image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
                telegram: '@motherfucker007'
            })
        });

        expect(createAdminResult.transactions).toHaveTransaction({
            from: root.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

    //    console.log(createAdminResult.events)

        const createUserResult = await master.sendDeployItem(user1.getSender(), {
            op: Opcodes.createUser,
            itemIndex: 0,
            itemOwnerAddress: user1.address,
            metadataDict: buildUserOnchainMetadata({
                name: 'User 1',
                description: '',
                image: 'tonstorage://B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/task.jpg',
                telegram: '@motherfucker666',
                bio: '666 is my fav number',
                site: 'https://mfucker.xyz',
                portfolio: '',
                resume: '',
                specialization: 'mother fuckin'
            })
        });

        expect(createUserResult.transactions).toHaveTransaction({
            from: user1.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });

        const createOrderResult = await master.sendDeployItem(user1.getSender(), {
            op: Opcodes.createOrder,
            itemIndex: 0,
            itemOwnerAddress: master.address,
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

        expect(createOrderResult.transactions).toHaveTransaction({
            from: user1.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });
    });

    it('admin should activate an order', async () => {
        const adminCollectionAddress = (await blockchain.getContract(master.address)).get('get_collection_address_by_id').stackReader.readAddress();
        const adminSbtAddress = (await blockchain.getContract(adminCollectionAddress)).get('get_nft_address_by_index', [{ type: 'int', value: 0n }]).stackReader.readAddress();

        const adminSbt = blockchain.openContract(AdminNft.createFromAddress(adminSbtAddress));
        
        const proveOwnershipResult = await adminSbt.sendProveOwnership(admin.getSender(), {
            dest: master.address,
            withContent: true,
            forwardPayload: beginCell()
                .storeUint(Opcodes.changeStatusFromModerationToActive, 32)
                .storeUint(0, 64)
            .endCell()
        });

        expect(proveOwnershipResult.transactions).toHaveTransaction({
            from: adminSbtAddress,
            to: master.address,
            success: true,
            outMessagesCount: 1,
            op: 0x0524c7ae
        });
    });

    // it('freelancer should send responce to order', async () => {

    // });

    // it('customer should choose executor of order', async () => {

    // });

    // it('freelancer should send notification of order completion', async () => {

    // });

    // it('customer should initiate arbitration', async () => {

    // });

    // it('admin should decide on arbitration', async () => {

    // });

    // it('customer should approve completion of order', async () => {

    // });

});


