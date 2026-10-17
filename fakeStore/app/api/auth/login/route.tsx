import { NextResponse } from 'next/server';
import {
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    buildSessionToken,
} from '@/services/authConfig';

export async function POST(request: Request) {
    const { role } = await request.json();

    const response = NextResponse.json({ success: true });
    // Pass the authorized client access footprint token explicitly via secure cookies
    response.cookies.set(SESSION_COOKIE_NAME, buildSessionToken(role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
}
