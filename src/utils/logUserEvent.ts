import amplitude from 'amplitude-js';

export const logUserEvent = (event: string) => {
  amplitude.getInstance().logEvent(event);
};

export const UserEvents = {
  HEADER_MY_TOKENS: 'HEADER_MY_TOKENS',
  HEADER_MY_COLLECTION: 'HEADER_MY_COLLECTION',
  HEADER_MY_ACCOUNTS: 'HEADER_MY_ACCOUNTS',
  HEADER_FAQ: 'HEADER_FAQ',
  CREATE_SUBSTRATE: 'CREATE_SUBSTRATE',
  ADD_ACCOUNT_VIA: 'ADD_ACCOUNT_VIA',
  CREATE_SUBSTRATE_STEP_1_NEXT: 'CREATE_SUBSTRATE_STEP_1_NEXT',
  CREATE_SUBSTRATE_STEP_2_NEXT: 'CREATE_SUBSTRATE_STEP_2_NEXT',
  CREATE_SUBSTRATE_STEP_2_PREVIOS: 'CREATE_SUBSTRATE_STEP_2_PREVIOS',
  CREATE_SUBSTRATE_STEP_3_NEXT: 'CREATE_SUBSTRATE_STEP_3_NEXT',
  CREATE_SUBSTRATE_STEP_3_PREVIOS: 'CREATE_SUBSTRATE_STEP_3_PREVIOS',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  CREATE_COLLECTION_STEP_1_NEXT: 'CREATE_COLLECTION_STEP_1_NEXT',
  CREATE_COLLECTION_STEP_2_NEXT: 'CREATE_COLLECTION_STEP_2_NEXT',
  CREATE_COLLECTION_STEP_2_PREVIOS: 'CREATE_COLLECTION_STEP_2_PREVIOS',
  REVIEW_COLLECTION: 'REVIEW_COLLECTION',
  SETTINGS_OF_COLLECTION: 'SETTINGS_OF_COLLECTION',
  CREATE_NFT: 'CREATE_NFT',
  CONFIRM_MORE: 'CONFIRM_MORE',
  CONFIRM_CLOSE: 'CONFIRM_CLOSE',
  TRANSFER_NFT: 'TRANSFER_NFT',
  COINS: 'COINS',
  SEND_COINS: 'SEND_COINS',
  GET_COINS: 'GET_COINS',
};