/**
 * .env.local yükleyici — diğer modüllerden ÖNCE import edilmeli.
 * ESM'de import hoisting nedeniyle module-level env.* okumaları bundan önce çalışırdı,
 * bu dosya side-effect ile dotenv.config'i import'lardan önce tetikler.
 */
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
