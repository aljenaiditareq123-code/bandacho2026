import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

declare global {
  // eslint-disable-next-line no-var
  var __bc_prisma__: PrismaClient | undefined;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ABSOLUTE_DB_PATH = path.resolve(PROJECT_ROOT, 'prisma', 'prisma', 'dev.db');

function resolveDatasourceUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) return undefined;

  if (envUrl.startsWith('file:')) {
    if (fs.existsSync(ABSOLUTE_DB_PATH)) {
      return `file:${ABSOLUTE_DB_PATH}`;
    }
  }
  return envUrl;
}

type PrismaClientOptions = ConstructorParameters<typeof PrismaClient>[0];

function buildClientOptions(): PrismaClientOptions {
  const url = resolveDatasourceUrl();
  return url
    ? { datasources: { db: { url } }, log: ['error'] }
    : { log: ['error'] };
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(buildClientOptions());
} else {
  if (!global.__bc_prisma__) {
    global.__bc_prisma__ = new PrismaClient(buildClientOptions());
  }
  prisma = global.__bc_prisma__;
}

export { prisma };
export default prisma;
