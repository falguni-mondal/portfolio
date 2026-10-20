// src/app/api/auth/login/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { connectDB } from '@/lib/mongodb';
import { AdminUserModel } from '@/models/AdminUser';
import { verifyTOTP, signAdminToken, verifyAdminToken } from '@/lib/totp';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  const authenticated = verifyAdminToken(token);
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { action, email, password, totpCode } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const adminUser = await AdminUserModel.findOne({ email: cleanEmail });

  if (!adminUser) {
    return NextResponse.json(
      { error: 'Admin user not found. Run: npx tsx scripts/seed-admin.ts <email> <password>' },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(String(password), adminUser.passwordHash);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid admin email or password.' }, { status: 401 });
  }

  // Action 1: Provision TOTP QR Code (Only after valid email + bcrypt password verification)
  if (action === 'SETUP_QR') {
    const otpauthUrl = `otpauth://totp/ByFalguniAdmin:${encodeURIComponent(
      adminUser.email
    )}?secret=${adminUser.totpSecret}&issuer=ByFalguniAdmin&algorithm=SHA1&digits=6&period=30`;
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);
    return NextResponse.json({ qrDataUrl, secret: adminUser.totpSecret });
  }

  // Action 2: Verify 6-Digit TOTP Code & Set Session Cookie
  if (!verifyTOTP(String(totpCode || ''), adminUser.totpSecret)) {
    return NextResponse.json(
      { error: 'Invalid 6-digit Authenticator code.' },
      { status: 401 }
    );
  }

  const jwt = signAdminToken(adminUser.email);
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_token', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('admin_token');
  return res;
}