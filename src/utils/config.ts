import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';
import logger from './logger';

/**
 * This file includes a series of configuration parameters, divided into categories.
 * It is also responsible for the loading of the .env and certificate files.
*/

// --- Environment config ---

// Loading .env file
logger.info('Loading environment...');
const result = dotenv.config();

if (result.error) {
  logger.warn('.env file not found or failed to load. This could lead to crashes.');
} else {
  logger.info('Environment loaded successfully');
}

// Use values from .env with fallbacks
export const APP_HOST: string = process.env.APP_HOST || 'localhost';
export const APP_PORT: number = Number(process.env.APP_PORT) || 8080;

export const POSTGRES_VERSION: number = Number(process.env.POSTGRES_VERSION) || 17.5;
export const POSTGRES_DB: string = process.env.POSTGRES_DB || 'progetto-pa-sgariglia';
export const POSTGRES_USER: string = process.env.POSTGRES_USER || 'db-admin';
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD || 'postgres';
export const POSTGRES_HOST: string = process.env.POSTGRES_HOST ||'postgres';
export const POSTGRES_PORT: number = Number(process.env.POSTGRES_PORT) || 5432;

export const POSTGRES_PATH: string = process.env.POSTGRES_PATH || '/var/lib/postgresql/data'
export const LOGS_PATH: string = process.env.LOGS_PATH || '/usr/app/logs'


// --- Certificates config ---

// Certificates
const CERTS_DIRECTORY: string = path.resolve(__dirname, '../../certs');
const PRIVATE_KEY_FILENAME: string = 'privateRS256.key'
const PUBLIC_KEY_FILENAME: string = 'publicRS256.key'

// Loading certificates
logger.info('Loading certificates...');

let privateKey: string;
let publicKey: string;

const loadCertificate = (filename: string) => fs.readFileSync(path.join(CERTS_DIRECTORY, filename), 'utf8');

try {
  privateKey = loadCertificate(PRIVATE_KEY_FILENAME);
  publicKey = loadCertificate(PUBLIC_KEY_FILENAME);
  logger.info('Certificates loaded successfully');
} catch {
  logger.error('[FATAL] Failed to load RSA keys. Exiting with code 1.');
  process.exit(1);
}

// Keys
export const PRIVATE_KEY: string = privateKey;
export const PUBLIC_KEY: string = publicKey;


// --- Miscellaneous config ---

// JWT
export const SIGNING_ALGORITHM: Algorithm = 'RS256';
export const TOKEN_DURATION = '1h'; // StringValue type, but it's not exported from jsonwebtokens

// Salting
export const SALT_ROUNDS: number = 10;

// Postgres connection
export const RETRY_COUNT: number = 5;
export const RETRY_DELAY: number = 2000;


// --- Model validation config ---

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
  static MAX_TOKEN_AMOUNT: number = 5000;
}

// SlotRequest
export class SlotRequestConfig {
  static MIN_TITLE_LENGTH: number = 3;
  static MAX_TITLE_LENGTH: number = 128;
  static MIN_REASON_LENGTH: number = 3;
  static MAX_REASON_LENGTH: number = 512;
  static MIN_REFUSAL_REASON_LENGTH: number = 3;
  static MAX_REFUSAL_REASON_LENGTH: number = 512;
  static UNUSED_DELETION_PENALTY: number = 1;
  static PARTIAL_USE_DELETION_PENALTY: number = 2;
}

// Calendar
export class CalendarConfig {
  static MIN_NAME_LENGTH: number = 3;
  static MAX_NAME_LENGTH: number = 128;
  static MIN_TOKEN_COST_PER_HOUR: number = 1;
  static DEFAULT_TOKEN_COST_PER_HOUR: number = 4;
  static MAX_TOKEN_COST_PER_HOUR: number = 50;
}

// ComputingResource
export class ComputingResourceConfig {
  static MAX_MODEL_LENGTH: number = 64;
  static MAX_MANUFACTURER_LENGTH: number = 64;
}

logger.info('Configuration file loaded successfully');