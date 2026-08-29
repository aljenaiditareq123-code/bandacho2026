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

const CANDIDATE_RELATIVE_DB_PATHS: ReadonlyArray<string> = [
  path.join('prisma', 'prisma', 'dev.db'),
  path.join('prisma', 'dev.db'),
  path.join('.next', 'server', 'prisma', 'prisma', 'dev.db'),
  path.join('.next', 'server', 'prisma', 'dev.db'),
  path.join('.next', 'standalone', 'prisma', 'prisma', 'dev.db'),
  path.join('.next', 'standalone', 'prisma', 'dev.db'),
];

function resolveAbsoluteDbPath(): string | null {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.startsWith('file:')) {
    const candidate = envUrl.slice('file:'.length);
    const absoluteFromEnv = path.isAbsolute(candidate)
      ? candidate
      : path.resolve(process.cwd(), candidate);
    if (fs.existsSync(absoluteFromEnv)) return absoluteFromEnv;
  }

  const rootsToTry: ReadonlyArray<string> = [
    PROJECT_ROOT,
    process.cwd(),
    path.resolve(__dirname, '..', '..'),
    path.resolve(PROJECT_ROOT, '.next', 'server'),
    path.resolve(PROJECT_ROOT, '.next', 'standalone'),
  ];

  for (const root of rootsToTry) {
    for (const rel of CANDIDATE_RELATIVE_DB_PATHS) {
      const full = path.resolve(root, rel);
      try {
        if (fs.existsSync(full) && fs.statSync(full).size > 0) return full;
      } catch {
        // ignore
      }
    }
  }

  for (const root of rootsToTry) {
    const walkPath = path.resolve(root, 'prisma');
    try {
      for (const entry of fs.readdirSync(walkPath, { withFileTypes: true, recursive: true })) {
        if (!entry.isFile()) continue;
        if (!entry.name.toLowerCase().endsWith('.db')) continue;
        const full = path.resolve(walkPath, entry.parentPath ?? walkPath, entry.name);
        if (fs.statSync(full).size > 0) return full;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function resolveDatasourceUrl(): string | undefined {
  const absolutePath = resolveAbsoluteDbPath();
  if (absolutePath) return `file:${absolutePath}`;
  return process.env.DATABASE_URL;
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
