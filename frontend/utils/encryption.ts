import CryptoJS from "crypto-js";
import { useRuntimeConfig } from "nuxt/app";

export const useEncryption = () => {
  const config = useRuntimeConfig();
  const key = config.public.encryptionKey;

  const encrypt = (text: string): string => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  const decrypt = (encryptedText: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return {
    encrypt,
    decrypt,
  };
};
