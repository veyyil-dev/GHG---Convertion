import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

const SECRET_KEY = "your_secret_key"; // should match your Flask backend

export function middleware() {
    const token = request.cookies.get('token')?.value;

    const url = request.nextUrl.clone();

    if (!token) {
        url.pathname = '/price';
        return NextResponse.redirect(url);
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userPaid = decoded.user_paid;

        if (url.pathname === '/dashboard' && userPaid !== 'Yes') {
            url.pathname = '/price';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        url.pathname = '/price';
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/home'],
};
