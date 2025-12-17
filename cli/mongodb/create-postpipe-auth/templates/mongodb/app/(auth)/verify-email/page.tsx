
import { verifyEmail } from '../../../lib/actions/auth';

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const token = searchParams.token as string;
    const resolvedSearchParams = await searchParams; // Next.js 15 safety

    if (!token) {
        return <div>Invalid token</div>;
    }

    const result = await verifyEmail(token);

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h1>Email Verification</h1>
            {result.success ? (
                <div style={{ color: 'green' }}>
                    <p>{result.message}</p>
                    <a href="/login" style={{ marginTop: '20px', display: 'inline-block' }}>Go to Login</a>
                </div>
            ) : (
                <div style={{ color: 'red' }}>
                    <p>{result.message}</p>
                </div>
            )}
        </div>
    );
}
