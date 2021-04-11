const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_RANDOM_BYTES_LENGTH = 12;

exports.encrypt = (secretKey, value) => {
  const iv = Buffer.from(randomBytes(IV_RANDOM_BYTES_LENGTH));
  const encryptionKey = Buffer.from(secretKey);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(value, 'utf8'),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  return encrypted.toString('base64');
};

exports.decrypt = (secretKey, value) => {
  const buffer = Buffer.from(value, 'base64');
  const iv = buffer.slice(0, 12);
  const authTag = buffer.slice(-16);
  const encrypted = buffer.slice(12, buffer.length - 16);

  const key = Buffer.from(secretKey.substr(-32));
  const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const output =  decipher.update(encrypted, 'binary', 'utf8');
  const final = decipher.final('utf8');

  return output + final;
};