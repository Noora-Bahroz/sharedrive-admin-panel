import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node scripts/inspect-data.mjs <email> <password>');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: 'AIzaSyDQRVPrm6vYeqP6L2vcSyVhM0VgDs9W7B0',
  authDomain: 'share-drive-6e6ad.firebaseapp.com',
  projectId: 'share-drive-6e6ad',
  storageBucket: 'share-drive-6e6ad.firebasestorage.app',
  messagingSenderId: '558153525743',
  appId: '1:558153525743:web:ee954daad412c4dd48ee1a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log('Signing in...');
  await signInWithEmailAndPassword(auth, email, password);
  console.log('Signed in!\n');

  const collections = ['users', 'drivers', 'rides', 'rideRequests', 'complaints', 'notifications', 'admins'];

  for (const colName of collections) {
    console.log(`\n========== ${colName} ==========`);
    try {
      const snap = await getDocs(query(collection(db, colName), limit(3)));
      if (snap.empty) {
        console.log('  (EMPTY - no documents)');
      } else {
        console.log(`  Showing ${snap.size} docs:\n`);
        snap.forEach(doc => {
          console.log(`  --- [${doc.id}] ---`);
          const data = doc.data();
          for (const [key, val] of Object.entries(data)) {
            const type = val === null ? 'null' : typeof val;
            const preview = val === null ? 'null' : typeof val === 'string' ? `"${val}"` : typeof val === 'object' ? JSON.stringify(val) : String(val);
            console.log(`    ${key}: (${type}) ${preview.length > 100 ? preview.slice(0, 100) + '...' : preview}`);
          }
          console.log('');
        });
      }
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
