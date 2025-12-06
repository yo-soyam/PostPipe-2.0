// Copy this file to: app/(auth)/login/page.tsx
'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { login } from '../actions'; // Update path after moving

const initialState = {
    message: '',
    success: false,
};

export default function LoginPage() {
    const [state, action] = useFormState(login, initialState);

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h1>Login</h1>
            <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>

            {state?.message && <p style={{ color: state.success ? 'green' : 'red' }}>{state.message}</p>}

            <p>
                <Link href="/auth/reset-password">Forgot Password?</Link>
            </p>
            <p>
                Don't have an account? <Link href="/signup">Sign Up</Link>
            </p>
        </div>
    );
}
