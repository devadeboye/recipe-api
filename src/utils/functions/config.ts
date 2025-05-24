import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export function readSecret(secretName: string): string | undefined {
  const secretPath = path.join('/run/secrets', secretName);
  if (fs.existsSync(secretPath)) {
    Logger.log(`Loaded secret ${secretName} from file.`);
    return fs.readFileSync(secretPath, 'utf8').trim();
  }
  Logger.log(`Using env variable for ${secretName}.`);
  return process.env[secretName];
}

export default (): Record<string, string | undefined> => ({
  CONNECTION_STRING: readSecret('CONNECTION_STRING'),
  // MONGO_INITDB_ROOT_USERNAME: readSecret('MONGO_INITDB_ROOT_USERNAME'),
  // MONGO_INITDB_ROOT_PASSWORD: readSecret('MONGO_INITDB_ROOT_PASSWORD'),

  JWT_LIFESPAN: readSecret('JWT_LIFESPAN'),
  JWT_SECRET: readSecret('JWT_SECRET'),
  NODE_ENV: readSecret('NODE_ENV'),
  TOKEN_SECRET: readSecret('TOKEN_SECRET'),

  SPOONACULAR_BASE_URL: readSecret('SPOONACULAR_BASE_URL'),
  SPOONACULAR_API_KEY: readSecret('SPOONACULAR_API_KEY'),
  SPOONACULAR_RATE_LIMIT: readSecret('SPOONACULAR_RATE_LIMIT'),
});
