'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { updateProfile, changePassword } from '../actions';

const initialState = {
    message: '',
    success: false,
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '40px auto',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid #eaeaea',
    },
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        color: 'white',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '10px',
        margin: 0,
    },
    subtitle: {
        margin: 0,
        opacity: 0.9,
        fontSize: '16px',
    },
    tabs: {
        display: 'flex',
        borderBottom: '1px solid #eaeaea',
        backgroundColor: '#f9f9f9',
    },
    tab: (active: boolean) => ({
        flex: 1,
        padding: '20px',
        textAlign: 'center' as const,
        cursor: 'pointer',
        background: active ? '#fff' : 'transparent',
        borderBottom: active ? '3px solid #764ba2' : '3px solid transparent',
        color: active ? '#764ba2' : '#666',
        fontWeight: '600',
        transition: 'all 0.2s ease',
    }),
    content: {
        padding: '40px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '30px',
        color: '#2d3748',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px',
    },
    formGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '16px',
        transition: 'border-color 0.2s',
        outline: 'none',
        boxSizing: 'border-box' as const,
    },
    button: {
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.1s',
    },
    message: (success: boolean) => ({
        marginTop: '20px',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: success ? '#f0fff4' : '#fff5f5',
        color: success ? '#2f855a' : '#c53030',
        border: `1px solid ${success ? '#c6f6d5' : '#fed7d7'}`,
    }),
    error: {
        color: '#e53e3e',
        fontSize: '13px',
        marginTop: '5px',
    }
};

export default function ProfilePage({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [updateState, updateAction] = useFormState(updateProfile, initialState);
    const [passwordState, passwordAction] = useFormState(changePassword, initialState);

    if (!user) {
        return (
            <div style={{ ...styles.container, textAlign: 'center' }}>
                <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#e53e3e' }}>Access Denied</h2>
                    <p>Please log in to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Account Settings</h1>
                    <p style={styles.subtitle}>Manage your profile and security preferences</p>
                </div>

                <div style={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={styles.tab(activeTab === 'profile')}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        style={styles.tab(activeTab === 'security')}
                    >
                        Security
                    </button>
                </div>

                <div style={styles.content}>
                    {activeTab === 'profile' && (
                        <div>
                            <h2 style={styles.sectionTitle}>Personal Details</h2>
                            <form action={updateAction}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Display Name</label>
                                        <input
                                            name="name"
                                            defaultValue={user.name}
                                            style={styles.input}
                                            placeholder="Your Name"
                                        />
                                        {updateState?.errors?.name && (
                                            <p style={styles.error}>{updateState.errors.name[0]}</p>
                                        )}
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email Address</label>
                                        <input
                                            name="email"
                                            defaultValue={user.email}
                                            style={styles.input}
                                            placeholder="your@email.com"
                                            type="email"
                                        />
                                        {updateState?.errors?.email && (
                                            <p style={styles.error}>{updateState.errors.email[0]}</p>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <button type="submit" style={styles.button}>
                                        Save Changes
                                    </button>
                                </div>

                                {updateState?.message && (
                                    <div style={styles.message(updateState.success)}>
                                        {updateState.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 style={styles.sectionTitle}>Change Password</h2>
                            <form action={passwordAction} style={{ maxWidth: '500px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        style={styles.input}
                                        placeholder="••••••••"
                                    />
                                    {passwordState?.errors?.currentPassword && (
                                        <p style={styles.error}>{passwordState.errors.currentPassword[0]}</p>
                                    )}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        style={styles.input}
                                        placeholder="••••••••"
                                    />
                                    {passwordState?.errors?.newPassword && (
                                        <p style={styles.error}>{passwordState.errors.newPassword[0]}</p>
                                    )}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        style={styles.input}
                                        placeholder="••••••••"
                                    />
                                    {passwordState?.errors?.confirmPassword && (
                                        <p style={styles.error}>{passwordState.errors.confirmPassword[0]}</p>
                                    )}
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <button type="submit" style={{ ...styles.button, background: '#2d3748' }}>
                                        Update Password
                                    </button>
                                </div>

                                {passwordState?.message && (
                                    <div style={styles.message(passwordState.success)}>
                                        {passwordState.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
