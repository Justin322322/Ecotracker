import { NextResponse } from 'next/server';
import { sleep } from '@/lib/utils';
import { loginSchema } from '@/lib/validations';
import { getDbPool } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    // Artificial delay to mitigate brute-force timing attacks and simulate latency
    await sleep(1500);
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const pool = getDbPool();

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0] as RowDataPacket & {
      id: number;
      name: string;
      email: string;
      password_hash: string;
    };

    const ok = await bcrypt.compare(password, user.password_hash as string);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session cookie
    const response = NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 200 });
    
    // Set session cookie
    response.cookies.set('session', JSON.stringify({ 
      id: user.id, 
      name: user.name, 
      email: user.email 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


