import keyring from '@polkadot/ui-keyring';

export class AccountUtils {
  // prefix address 42
  static normalizedAddressAccount(address: string) {
    return keyring.encodeAddress(keyring.decodeAddress(address), 42);
  }

  static encodeAddress(address: string, ss58Prefix?: number) {
    return keyring.encodeAddress(keyring.decodeAddress(address), ss58Prefix);
  }
}
