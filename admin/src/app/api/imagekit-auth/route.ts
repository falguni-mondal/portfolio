// src/app/api/imagekit-auth/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_placeholder';
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400;
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return NextResponse.json(
    {
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/byfalguni',
    },
    { headers: corsHeaders() }
  );
}