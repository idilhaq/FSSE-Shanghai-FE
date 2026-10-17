import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/services/authConfig';

export async function POST() {
    const response = NextResponse.json({ success: true });
    // Clear the session cookie so the proxy stops treating the client as authenticated
    response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
    return response;
}
