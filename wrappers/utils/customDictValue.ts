import { Address, Cell, DictionaryValue } from "ton-core";

export const collectionsDictValue: DictionaryValue<
    {
        collectionAddress: Address
        itemCode: Cell;
    }> = {
        serialize(src, builder) {
            builder.storeAddress(src.collectionAddress);
            builder.storeRef(src.itemCode);
        },

        parse() {
            return {
                collectionAddress: new Address(0, Buffer.alloc(32)),
                itemCode: new Cell()
            }
        }
};