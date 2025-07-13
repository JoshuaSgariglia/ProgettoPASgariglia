import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';

// Loading .env file
console.info('Loading environment...');
const result = dotenv.config();

if (result.error) {
  console.warn('.env file not found or failed to load. This could lead to crashes.');
} else {
  console.info('Environment loaded successfully');
}

// Use values from .env with fallbacks
export const APP_HOST: string = process.env.APP_HOST || 'localhost';
export const APP_PORT: number = Number(process.env.APP_PORT) || 8080;

// Certificates
const CERTS_DIRECTORY: string = path.resolve(__dirname, '../../certs');
const PRIVATE_KEY_FILENAME: string = 'privateRS256.key'
const PUBLIC_KEY_FILENAME: string = 'publicRS256.key'

// Loading certificates
console.info('Loading certificates...');

let privateKey: string;
let publicKey: string;

const loadCertificate = (filename: string) => fs.readFileSync(path.join(CERTS_DIRECTORY, filename), 'utf8');

try {
  privateKey = loadCertificate(PRIVATE_KEY_FILENAME);
  publicKey = loadCertificate(PUBLIC_KEY_FILENAME);
  console.info('Certificates loaded successfully');
} catch {
  console.error('[FATAL] Failed to load RSA keys. Exiting with code 1.');
  process.exit(1);
}

// Keys
export const PRIVATE_KEY: string = privateKey;
export const PUBLIC_KEY: string = publicKey;

// JWT
export const SIGNING_ALGORITHM: Algorithm = 'RS256';
export const TOKEN_DURATION = '1h'; // StringValue type, but it's not exported from jsonwebtokens

// Postgres connection
export const RETRY_COUNT: number = 5;
export const RETRY_DELAY: number = 2000;

// --- Model validation ---

// User
export class UserConfig {
  static MIN_USERNAME_LENGTH: number = 3;
  static MAX_USERNAME_LENGTH: number = 32;
  static MAX_EMAIL_LENGTH: number = 128;
  static MIN_NAME_LENGTH: number = 2;
  static MAX_NAME_LENGTH: number = 64;
  static MIN_SURNAME_LENGTH: number = 2;
  static MAX_SURNAME_LENGTH: number = 64;
  static MIN_PASSWORD_LENGTH: number = 6;
  static MAX_PASSWORD_LENGTH: number = 64;
  static MIN_TOKEN_AMOUNT: number = 0;
  static INITIAL_TOKEN_AMOUNT: number = 50;
  static MAX_TOKEN_AMOUNT: number = 5000
}


// SlotRequest
export class SlotRequestConfig {
  static MAX_TITLE_LENGTH: number = 128;
  static MAX_REASON_LENGTH: number = 512;
  static MAX_REFUSAL_REASON_LENGTH: number = 512;
}

// Calendar
export class CalendarConfig {
  static MAX_NAME_LENGTH: number = 128;
}

// ComputingResource
export class ComputingResourceConfig {
  static MAX_MODEL_LENGTH: number = 64;
  static MAX_MANUFACTURER_LENGTH: number = 64;
}