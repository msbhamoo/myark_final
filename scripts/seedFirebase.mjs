import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'sample-opportunities.json');

const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const envPath = path.join(rootDir, file);
  if (existsSync(envPath)) {
    loadEnv({ path: envPath });
  }
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin environment variables. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

const main = async () => {
  const raw = await readFile(dataPath, 'utf8');
  const opportunities = JSON.parse(raw);

  for (const entry of opportunities) {
    const { id, ...rest } = entry;
    const docId =
      id ||
      rest.slug ||
      rest.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `opportunity-${Date.now()}`;

    const payload = {
      ...rest,
      status: rest.status ?? 'published',
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    await db.collection('opportunities').doc(docId).set(payload, { merge: true });
    console.log(`Upserted opportunity "${docId}"`);
  }

  console.log('Seeding complete.');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed Firestore:', error);
    process.exit(1);
  });
