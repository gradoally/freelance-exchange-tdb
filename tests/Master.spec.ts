import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton-community/sandbox';
import { Address, Cell, Dictionary, toNano } from 'ton-core';
import { Master } from '../wrappers/Master';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { buildNftCollectionDataCell } from '../wrappers/utils/collectionHelpers';
import { AdminCollection } from '../wrappers/AdminCollection';

describe('Master', () => {
    let code: Cell;
    let master: SandboxContract<Master>
    let blockchain: Blockchain;
    let admin: SandboxContract<TreasuryContract>;
    let collectionDataCell: Cell;

    beforeAll(async () => {
        code = await compile('Master');
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        admin = await blockchain.treasury('admin');

        master = blockchain.openContract(
            Master.createFromConfig({
                ownerAddress: admin.address,
                nextCollectionIndex: 0,
                collectionsDict: Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Address())
            }, code)
        );

        const deployer = await blockchain.treasury('deployer');
        const deployResult = await master.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: master.address,
            deploy: true,
        });

        collectionDataCell = buildNftCollectionDataCell({
            collectionName: 'Admin Collection with onchain',
            collectionDescription: 'onchain meta onchain meta',
            collectionImageUrl: 'https://tonbyte.com/gateway/B9C487EE13678E60C95930628460E8EB9AEBC629BEE41B501C6C1A70B9012BD4/collection.jpg',
            ownerAddress: admin.address,
            nextItemIndex: 0,
            commonContent: '',
            nftItemCode: await compile('AdminNft'),
            royaltyParams: {
                royaltyFactor: 12,
                royaltyBase: 100,
                royaltyAddress: admin.address
            }
        });
    });

    it('should mint collections and increase nextCollectionIndex', async () => {

    //    console.log(master.address);

        // await blockchain.setVerbosityForAddress(master.address, {
        //     print: true,
        //     blockchainLogs: false,
        //     debugLogs: false,
        //     vmLogs: 'vm_logs'
        // });
        
        const res = await master.sendDeployCollection(admin.getSender(), {
            collectionCode: await compile('AdminCollection'),
            collectionData: collectionDataCell,
        });
        
        expect(res.transactions).toHaveTransaction({
            from: admin.address,
            to: master.address,
            success: true,
            outMessagesCount: 1
        });
        
        const nextCollectionIndex = (await blockchain.getContract(master.address)).get('get_master_data').stackReader.skip(1).readNumber();
        
        expect(nextCollectionIndex).toEqual(1);

        printTransactionFees(res.transactions);
    });

    it('should deploy nft item', async () => {
        const collection = await AdminCollection.createFromConfig(
            {

            }, await compile('AdminCollection')
        )
    });
});


