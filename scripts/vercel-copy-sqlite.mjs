#!/usr/bin/env node
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SOURCE_CANDIDATES = [
  path.resolve(PROJECT_ROOT, 'prisma', 'prisma', 'dev.db'),
  path.resolve(PROJECT_ROOT, 'prisma', 'dev.db'),
  path.resolve(process.cwd(), 'prisma', 'prisma', 'dev.db'),
  path.resolve(process.cwd(), 'prisma', 'dev.db'),
];

const DESTINATION_TARGETS = [
  path.resolve(PROJECT_ROOT, '.next', 'server', 'prisma', 'prisma', 'dev.db'),
  path.resolve(PROJECT_ROOT, '.next', 'server', 'prisma', 'dev.db'),
  path.resolve(PROJECT_ROOT, '.next', 'standalone', 'prisma', 'prisma', 'dev.db'),
  path.resolve(PROJECT_ROOT, '.next', 'standalone', 'prisma', 'dev.db'),
];

function findSourceDb() {
  for (const cand of SOURCE_CANDIDATES) {
    try {
      const stat = fs.statSync(cand);
      if (stat.isFile() && stat.size > 0) return cand;
    } catch {
      // ignore
    }
  }
  return null;
}

function copyFileAtomic(src, dest) {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${dest}.tmp-${process.pid}`;
  fs.copyFileSync(src, tmp);
  fs.renameSync(tmp, dest);
}

async function smokeRead(src) {
  try {
    const prisma = new PrismaClient({
      datasources: { db: { url: `file:${src}` } },
      log: [],
    });
    const order = await prisma.order.findFirst({
      where: { trackingNumber: 'AE123456789' },
      include: { milestones: true },
    });
    const products = await prisma.product.findMany();
    const users = await prisma.user.count();
    console.log(`  [smoke] order AE123456789 = ${Boolean(order) ? 'FOUND' : 'MISSING'} (stage=${order?.currentStage ?? 'n/a'}, milestones=${order?.milestones.length ?? 0})`);
    console.log(`  [smoke] products = ${products.length}, users = ${users}`);
    await prisma.$disconnect();
    return Boolean(order);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.warn(`  [smoke] warn: ${err}`);
    return false;
  }
}

async function main() {
  const src = findSourceDb();
  if (!src) {
    console.warn('[vercel-copy-sqlite] No source SQLite DB found in any of:', SOURCE_CANDIDATES.join(', '));
    process.exitCode = 0;
    return;
  }

  const size = fs.statSync(src).size;
  console.log(`[vercel-copy-sqlite] Source DB: ${path.relative(PROJECT_ROOT, src)} (${size} bytes)`);
  await smokeRead(src);

  let copied = 0;
  for (const dest of DESTINATION_TARGETS) {
    copyFileAtomic(src, dest);
    console.log(`  -> ${path.relative(PROJECT_ROOT, dest)}`);
    copied += 1;
  }

  console.log(`[vercel-copy-sqlite] Copied seeded demo DB to ${copied} destination(s) inside .next tree.`);
}

void main();

