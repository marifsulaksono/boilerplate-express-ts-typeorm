import * as fs from 'fs';
import { publicEncrypt, privateDecrypt, createSign, createVerify } from 'crypto';

/*
	this helper is for encrypting and decrypting message

	more info contact me @marifsulaksono
*/

// Read RSA keys
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_FILEPATH, 'utf8');
const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILEPATH, 'utf8');

// Encrypt message using public key
export const EncryptMessage = async (message: string): Promise<string> => {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

// Decrypt message using private key
export const DecryptMessage = async (encryptedMessage: string): Promise<string> => {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
};

// Sign the message using the private key
export const CreateSignatureMessage = (message: string): string => {
  const signer = createSign('RSA256');
  signer.update(message);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');  // Generate the signature in base64 format
  return signature;
};

// Verify the signature using the public key
export const VerifySignature = (message: string, signature: string): boolean => {
  const verifier = createVerify('RSA256');
  verifier.update(message);
  verifier.end();
  const isValid = verifier.verify(publicKey, signature, 'base64');  // Verify the signature
  return isValid;
};