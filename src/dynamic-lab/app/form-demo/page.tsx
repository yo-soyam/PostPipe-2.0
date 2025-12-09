'use client';

import { useState } from 'react';

export default function FormDemoPage() {
    const [activeTab, setActiveTab] = useState<'contact' | 'feedback' | 'newsletter'>('contact');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Form handlers
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, endpoint: string) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Convert rating to number for feedback
        if (data.rating) {
            data.rating = Number(data.rating) as any;
        }

        try {
            const res = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Something went wrong');

            setStatus({ type: 'success', message: `Success! Created ID: ${result.data._id}` });
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>Form APIs Demo</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                {['contact', 'feedback', 'newsletter'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab as any); setStatus({ type: '', message: '' }); }}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === tab ? '#2563eb' : 'transparent',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                background: 'white'
            }}>
                {/* Contact Form */}
                {activeTab === 'contact' && (
                    <form onSubmit={(e) => handleSubmit(e, 'contact')} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#334155' }}>Contact Us</h2>
                        <Input name="name" placeholder="Your Name" required />
                        <Input name="email" type="email" placeholder="your@email.com" required />
                        <Input name="subject" placeholder="Subject" required />
                        <Textarea name="message" placeholder="Your message..." required />
                        <Button loading={loading}>Send Message</Button>
                    </form>
                )}

                {/* Feedback Form */}
                {activeTab === 'feedback' && (
                    <form onSubmit={(e) => handleSubmit(e, 'feedback')} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#334155' }}>Give Feedback</h2>
                        <Input name="email" type="email" placeholder="Email (Optional)" />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 500, color: '#475569' }}>Rating</label>
                            <select name="rating" required style={inputStyle}>
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 500, color: '#475569' }}>Category</label>
                            <select name="category" required style={inputStyle}>
                                <option value="general">General</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Textarea name="message" placeholder="Tell us what you think..." required />
                        <Button loading={loading}>Submit Feedback</Button>
                    </form>
                )}

                {/* Newsletter Form */}
                {activeTab === 'newsletter' && (
                    <form onSubmit={(e) => handleSubmit(e, 'newsletter')} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#334155' }}>Subscribe to Newsletter</h2>
                        <p style={{ color: '#64748b', margin: 0 }}>Stay updated with our latest news and offers.</p>
                        <Input name="email" type="email" placeholder="Enter your email" required />
                        <Button loading={loading}>Subscribe</Button>
                    </form>
                )}

                {/* Status Message */}
                {status.message && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderRadius: '8px',
                        background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: status.type === 'success' ? '#166534' : '#991b1b',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable Components
const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box' as const
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {props.placeholder && <label style={{ fontWeight: 500, color: '#475569' }}>{props.placeholder}</label>}
        <input style={inputStyle} {...props} />
    </div>
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {props.placeholder && <label style={{ fontWeight: 500, color: '#475569' }}>{props.placeholder}</label>}
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} {...props} />
    </div>
);

const Button = ({ children, loading }: { children: React.ReactNode, loading: boolean }) => (
    <button
        disabled={loading}
        style={{
            padding: '14px',
            background: loading ? '#94a3b8' : '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px',
            transition: 'background 0.2s'
        }}
    >
        {loading ? 'Processing...' : children}
    </button>
);
