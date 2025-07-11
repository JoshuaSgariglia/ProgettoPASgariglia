import fs from 'fs';
import path from 'path';

// Loading certificates
const CERTS_DIRECTORY: string = path.resolve(__dirname, '../../certs');
const PRIVATE_KEY_FILENAME: string = 'privateRS256.key'
const PUBLIC_KEY_FILENAME: string = 'publicRS256.key'

let privateKey: string;
let publicKey: string;

const loadCertificate = (filename: string) => fs.readFileSync(path.join(CERTS_DIRECTORY, filename), 'utf8');

try {
  privateKey = loadCertificate(PRIVATE_KEY_FILENAME);
  publicKey = loadCertificate(PUBLIC_KEY_FILENAME);
} catch {
  console.error('[FATAL] Failed to load RSA keys. Exiting with code 1.');
  process.exit(1);
}

// Certificates
export const PRIVATE_KEY: string = privateKey;
export const PUBLIC_KEY: string = publicKey;

// JWT
export const SIGNING_ALGORITHM = "RS256"
export const TOKEN_DURATION = "1h"

// Postgres
export const RETRY_COUNT: number = 5
export const RETRY_DELAY: number = 2000