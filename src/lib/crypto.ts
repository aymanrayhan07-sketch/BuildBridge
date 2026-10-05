import crypto from 'crypto';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'buildbridge-secure-key-32-chars-long!!';

export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••';
  const prefix = key.startsWith('sk-or-') ? 'sk-or-' : key.slice(0, 4);
  const suffix = key.slice(-4);
  return `${prefix}••••${suffix}`;
}

export function encryptKey(plainText: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch {
    // Fallback reversible encoding in environments where crypto has quirks
    return Buffer.from(plainText).toString('base64');
  }
}

export function decryptKey(cipherText: string): string {
  try {
    if (!cipherText.includes(':')) {
      return Buffer.from(cipherText, 'base64').toString('utf8');
    }
    const [ivHex, encrypted] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return cipherText;
  }
}
