import crypto from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/user';

export const ADMIN_COOKIE = 'admin-session';
const COOKIE_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const getSecret = () => process.env.ADMIN_PANEL_SECRET;

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  iat: number;
}

const sign = (data: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const createSessionToken = (payload: Omit<AdminSessionPayload, 'iat'>): string | null => {
  const secret = getSecret();
  if (!secret) return null;

  const data = { ...payload, iat: Date.now() };
  const dataString = JSON.stringify(data);
  const signature = sign(dataString, secret);

  return `${Buffer.from(dataString).toString('base64')}.${signature}`;
};

export const verifySessionToken = (token: string | undefined): AdminSessionPayload | null => {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;

  const [dataBase64, signature] = token.split('.');
  if (!dataBase64 || !signature) return null;

  const dataString = Buffer.from(dataBase64, 'base64').toString('utf-8');
  const expectedSignature = sign(dataString, secret);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    return JSON.parse(dataString) as AdminSessionPayload;
  } catch {
    return null;
  }
};

// Backward compatibility wrapper (checks if valid session exists)
export const verifyAdminSession = (cookieValue: string | undefined): boolean => {
  return !!verifySessionToken(cookieValue);
};

export const getAdminSession = (request: NextRequest | Request): AdminSessionPayload | null => {
  let cookieValue: string | undefined;

  if ('cookies' in request && typeof request.cookies.get === 'function') {
    cookieValue = (request as NextRequest).cookies.get(ADMIN_COOKIE)?.value;
  } else {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.split(';').map(p => p.trim()).find(p => p.startsWith(`${ADMIN_COOKIE}=`));
      if (match) {
        cookieValue = decodeURIComponent(match.split('=')[1]);
      }
    }
  }

  return verifySessionToken(cookieValue);
};

export const hasAdminSessionFromRequest = (request: Request | NextRequest): boolean => {
  return !!getAdminSession(request);
};

export const applyAdminSessionCookie = (response: NextResponse, payload: Omit<AdminSessionPayload, 'iat'>) => {
  const token = createSessionToken(payload);
  if (!token) {
    throw new Error('ADMIN_PANEL_SECRET is not configured.');
  }

  response.cookies.set(ADMIN_COOKIE, token, {
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

export const requireAdminSession = (request?: Request | NextRequest): boolean => {
  if (!request) {
    throw new Error('Unauthorized');
  }
  if (!hasAdminSessionFromRequest(request)) {
    throw new Error('Unauthorized');
  }
  return true;
};

/**
 * Check if the current admin session has a specific permission
 * Superadmins always have all permissions
 */
export const requirePermission = (request: Request | NextRequest, permission: string): boolean => {
  const session = getAdminSession(request);
  if (!session) {
    throw new Error('Unauthorized');
  }

  // Superadmins have all permissions
  if (session.role === 'superadmin') {
    return true;
  }

  // Check custom permissions
  if (session.permissions?.includes(permission)) {
    return true;
  }

  throw new Error(`Forbidden: Missing permission '${permission}'`);
};
