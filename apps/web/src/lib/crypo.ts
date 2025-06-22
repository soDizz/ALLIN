import CryptoJS from 'crypto-js';

export function encryptData(plainText: string, key: string) {
  return CryptoJS.AES.encrypt(plainText, key).toString();
}

export function decryptData(cipherText: string, key: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
