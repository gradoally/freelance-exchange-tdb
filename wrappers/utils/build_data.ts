import { beginCell, Cell, Address } from "ton";
import { Dictionary } from "ton-core";
import crypto from "crypto";

const ONCHAIN_CONTENT_PREFIX = 0x00;

function sha256Hash(input: string): bigint {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    const hashBuffer = hash.digest();
    const hashHex = hashBuffer.toString('hex');
    return BigInt('0x' + hashHex);
}

function unixToFriendly(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'longOffset',
    };

    const englishLocale = 'en-US';
    options.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${date.toLocaleDateString(englishLocale, options)}`;
}

export function buildOrderOnchainMetadata(data: {
    name: string;
    description: string;
    image: string;
    status: string;
    amount: string;
    technical_assignment: string;
    starting_unix_time: number;
    ending_unix_time: number;
    creation_unix_time: number;
    category: string;
    customer_addr: string;
    freelancer_addr: string;
}): Dictionary<bigint, Cell> {
    let dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    );

    data.description = 'Amount: ' + data.amount + ' TON • Status: ' + data.status +
        ' • Task Description: ' + data.description + ' • Category: ' + data.category +
        ' • Customer Address: ' + data.customer_addr + ' • Freelancer address: '
        + `${data.freelancer_addr == '' ? 'not assigned' : data.freelancer_addr}` +
        ' • Creation time: ' + unixToFriendly(data.creation_unix_time) + ' • To be started at: '
        + unixToFriendly(data.starting_unix_time) + ' • To be terminated at: ' +
        unixToFriendly(data.ending_unix_time) + ' • Technical assignment (TON Storage): '
        + data.technical_assignment;

    Object.entries(data).forEach(([key, value]) => {
        dict.set(sha256Hash(key), beginCell()
            .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
            .storeStringTail(typeof value === 'number' ? `${value}` : value)
            .endCell());
    });

    return dict;
}

export function buildAdminOnchainMetadata(data: {
    name: string;
    image: string;
    description: string;
    telegram: string;
}): Dictionary<bigint, Cell> {
    let dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    );

    data.description = 'Admin of Reach. ' + 'Telegram ' + data.telegram

    Object.entries(data).forEach(([key, value]) => {
        dict.set(sha256Hash(key), beginCell()
            .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
            .storeStringTail(typeof value === 'number' ? `${value}` : value)
            .endCell());
    });

    return dict;
}

export function buildUserOnchainMetadata(data: {
    name: string;
    image: string;
    description: string;
    telegram: string;
    bio: string;
    site: string;
    portfolio: string;
    resume: string;
    specialization: string;
}): Dictionary<bigint, Cell> {
    let dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    );

    data.description = 'User of Reach. ' + 'Telegram: ' + data.telegram

    Object.entries(data).forEach(([key, value]) => {
        dict.set(sha256Hash(key), beginCell()
            .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
            .storeStringTail(typeof value === 'number' ? `${value}` : value)
            .endCell());
    });

    return dict;
}