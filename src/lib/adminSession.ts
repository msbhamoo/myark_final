import crypto from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE = 'admin-session';
const COOKIE_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const getSecret = () => process.env.ADMIN_PANEL_SECRET;

const hashSecret = (secret: string) =>
  crypto.createHash('sha256').update(secret).digest('hex');

export const getExpectedSession = (): string | null => {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  return hashSecret(secret);
};

const equals = (a: string, b: string) => {
  const bufferA = Buffer.from(a, 'utf-8');
  const bufferB = Buffer.from(b, 'utf-8');
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const verifyAdminSession = (cookieValue: string | undefined): boolean => {
  const expected = getExpectedSession();
  if (!cookieValue || !expected) {
    return false;
  }
  return equals(cookieValue, expected);
};

export const hasAdminSessionInRequest = (request: NextRequest): boolean => {
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminSession(cookie);
};

export const hasAdminSessionFromRequest = (request: Request | NextRequest): boolean => {
  const maybeNext = request as NextRequest;
  if (maybeNext.cookies && typeof maybeNext.cookies.get === 'function') {
    const cookieValue = maybeNext.cookies.get(ADMIN_COOKIE)?.value;
    if (cookieValue !== undefined) {
      return verifyAdminSession(cookieValue);
    }
  }
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return false;
  }
  const cookiePairs = cookieHeader.split(';').map((pair) => pair.trim());
  const match = cookiePairs.find((pair) => pair.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) {
    return false;
  }
  const [, value] = match.split('=');
  return verifyAdminSession(decodeURIComponent(value ?? ''));
};

export const applyAdminSessionCookie = (response: NextResponse) => {
  const expected = getExpectedSession();
  if (!expected) {
    throw new Error('ADMIN_PANEL_SECRET is not configured.');
  }

  response.cookies.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_TTL_SECONDS,
    path: '/',
  });

  return response;
};

export const clearAdminSessionCookie = (response: NextResponse) => {
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  return response;
};
