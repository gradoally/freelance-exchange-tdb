import { beginCell, Builder, Cell, Dictionary, Slice } from 'ton-core';
import { Sha256 } from '@aws-crypto/sha256-js';
import { readFileSync } from 'fs';

export const ON_CHAIN_CONTENT_PREFIX = 0x00;

export const SNAKE_PREFIX = 0x00;
export const CHUNK_PREFIX = 0x01;

const imageData = readFileSync('logo.svg').toString('utf-8');

export const data = {
    name: 'Some Order',
    description: 'Some Order Desription',
    image: imageData,
    status: 'Active',
    amount: '1000',
    technical_assigment: 'https://whales.infura-ipfs.io/ipfs/QmQ5QiuLBEmDdQmdWcEEh2rsW53KWahc63xmPVBUSp4teG/3880.png',
    starting_unix_time: '1692831600',
    ending_unix_time: '1692831600',
    creation_unix_time: '1692831600',
    category: 'Блокчейн TON',
    customer_addr: 'EQDWfTV0XtuUrRYF8BqOm1U2yr3axYlpvxxnGXyx2nwIypM3',
};

export const sha256 = (value: string) => {
  const sha = new Sha256();
  sha.update(value);

  return Buffer.from(sha.digestSync());
};

export const buildOnChainMetadata = (data: any): Cell => {
  const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());

  Object.keys(data).forEach(key => {
    const encoding: BufferEncoding = key === 'image_data' ? 'ascii' : 'utf8';
    dict.set(sha256(key), snake(Buffer.from(data[key] || '', encoding), beginCell().storeUint(SNAKE_PREFIX, 8)));
  });

  return beginCell().storeInt(ON_CHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell();
}

export const snake = (bufferToStore: Buffer, builder: Builder): Cell => {
  const availableBytes = Math.floor(builder.availableBits / 8);
  const currentCellContent = bufferToStore.subarray(0, availableBytes);
  builder.storeBuffer(currentCellContent);
  bufferToStore = bufferToStore.subarray(availableBytes);
  if (!!bufferToStore.length) {
    builder.storeRef(snake(bufferToStore, beginCell()));
  }
  return builder.endCell();
}

export const parseSnake = (slice: Slice, encoding: BufferEncoding): string => {
  const currentBuffer = slice.loadBuffer(Math.floor(slice.remainingBits / 8));
  if (slice.remainingRefs) {
    return currentBuffer.toString(encoding) + parseSnake(slice.loadRef().beginParse(), encoding);
  }
  return currentBuffer.toString(encoding);
};

export const parseChunk = (slice: Slice, encoding: BufferEncoding): string => {
  const dict = slice.loadDict(Dictionary.Keys.Uint(32), Dictionary.Values.Cell());
  let result = '';
  for (const value of dict.values()) {
    const slice = value.beginParse();
    const currentBuffer = slice.loadBuffer(Math.floor(slice.remainingBits / 8));
    result = result  + currentBuffer.toString(encoding);
  }
  return result;
};

export const parseMetadata = (dict: Dictionary<Buffer, Cell>, keys: string[]): any => {
  return keys.reduce((result, key) => {
    const cell = dict.get(sha256(key));
    if (!cell) {
      return { ...result, [key]: undefined };
    }
    const slice = cell.beginParse();
    const prefix = slice.loadUint(8);
    const encoding: BufferEncoding = key === 'image_data' ? 'ascii' : 'utf8';
    const value = prefix ? parseChunk(slice, encoding) : parseSnake(slice, encoding);
    return { ...result, [key]: value };
  }, {} as any);
}