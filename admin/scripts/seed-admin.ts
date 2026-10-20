// scripts/seed-admin.ts
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AdminUserModel } from '../src/models/AdminUser';

// Load .env.local automatically
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function generateBase32Secret(length = 32): string {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += BASE32_CHARS[bytes[i] % 32];
  }
  return secret;
}

async function seedAdmin() {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];

  if (!emailArg || !passwordArg) {
    console.error('\n❌ Usage: npx tsx scripts/seed-admin.ts <email> <password>');
    console.error('👉 Example: npx tsx scripts/seed-admin.ts byfalguni@gmail.com "MyStrongPass123!"\n');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: MONGODB_URI is missing in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const cleanEmail = emailArg.toLowerCase().trim();
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(passwordArg, salt);

  // Preserve existing TOTP secret if updating password, or generate a new Base32 secret
  const existing = await AdminUserModel.findOne({ email: cleanEmail });
  const totpSecret = existing?.totpSecret || generateBase32Secret(24);

  await AdminUserModel.findOneAndUpdate(
    { email: cleanEmail },
    {
      $set: {
        email: cleanEmail,
        passwordHash,
        totpSecret,
      },
    },
    { upsert: true, new: true }
  );

  console.log('\n🎉 Admin User Injected Successfully into MongoDB!');
  console.log('--------------------------------------------------');
  console.log(`📧 Admin Email:       ${cleanEmail}`);
  console.log(`🔒 Bcrypt Hash:       "🤫🤫🤫"`);
  console.log(`🔑 TOTP 2FA Secret:   "🤫🤫🤫"`);
  console.log('--------------------------------------------------\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err: unknown) => {
  console.error('❌ Failed to seed admin:', err);
  process.exit(1);
});