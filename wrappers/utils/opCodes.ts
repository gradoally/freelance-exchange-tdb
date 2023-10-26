import { crc32 } from './crc32';

export const Opcodes = {
    changeRoot: crc32('op::change_root'),
    deployCollection: crc32('op::deploy_collection'),
    createUser: crc32('op::create_user'),
    createOrder: crc32('op::create_order'),
    editContent: crc32('op::edit_content'),
    changeStatusFromModerationToActive: crc32('op::change_status_from_moderation_to_active'),
    addResponseToTask: crc32('op::add_response_to_task'),
    transferOrder: crc32('op::transfer_order'),
    withdrawFunds: crc32('op::withdraw_funds'),
    editDappCode: crc32('op::edit_dapp_code'),
    destroySbt: crc32('op::destroy_sbt'),
    revokeSbt: crc32('op::revoke_sbt')
};