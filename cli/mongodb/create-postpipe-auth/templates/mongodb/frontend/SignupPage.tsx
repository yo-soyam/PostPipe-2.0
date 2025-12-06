// Copy this file to: app/(auth)/signup/page.tsx
'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { signup } from '../actions'; // Update path after moving

const initialState = {
    message: '',
    success: false,
    errors: {} as Record<string, string[]>,
};

export default function SignupPage() {
    const [state, action] = useFormState(signup, initialState);

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h1>Sign Up</h1>
            <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="name" placeholder="Name" required />
                {state?.errors?.name && <p style={{ color: 'red' }}>{state.errors.name}</p>}

                <input name="email" type="email" placeholder="Email" required />
                {state?.errors?.email && <p style={{ color: 'red' }}>{state.errors.email}</p>}

                <input name="password" type="password" placeholder="Password" required />
                {state?.errors?.password && <p style={{ color: 'red' }}>{state.errors.password}</p>}

                <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                {state?.errors?.confirmPassword && <p style={{ color: 'red' }}>{state.errors.confirmPassword}</p>}

                <button type="submit">Create Account</button>
            </form>

            {state?.message && <p>{state.message}</p>}

            <p>Already have an account? <Link href="/login">Login</Link></p>
        </div>
    );
}
