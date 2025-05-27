const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; 
const IV_LENGTH = 16;  

const ENCRYPTION_KEY = process.env.FILE_ENCRYPTION_KEY || (() => {
    console.warn('⚠️  Using temporary encryption key - set FILE_ENCRYPTION_KEY in .env for production');
    return crypto.randomBytes(KEY_LENGTH).toString('hex');
})();

/**
 * Encrypts a file and returns encryption metadata
 * @param {string} filePath - Path to file to encrypt
 * @returns {Promise<{encryptedData: Buffer, iv: string}>}
 */
const encryptFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const iv = crypto.randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        const fileData = fs.readFileSync(filePath);
        const encryptedData = Buffer.concat([
            cipher.update(fileData),
            cipher.final()
        ]);

        return {
            encryptedData,
            iv: iv.toString('hex') 
        };
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('File encryption failed');
    }
};

/**
 * Decrypts file data
 * @param {Buffer} encryptedData - Encrypted data
 * @param {string} ivHex - Initialization vector (hex string)
 * @returns {Buffer} Decrypted data
 */
const decryptFile = (encryptedData, ivHex) => {
    try {
        const iv = Buffer.from(ivHex, 'hex');
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        return Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('File decryption failed');
    }
};

module.exports = {
    encryptFile,
    decryptFile,
    ENCRYPTION_KEY 
};