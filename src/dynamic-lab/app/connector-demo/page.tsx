'use client';

import React, { useState, useEffect } from 'react';

export default function PostPipeDemo() {
    const [step, setStep] = useState(1);
    const [credentials, setCredentials] = useState<{ id: string; secret: string } | null>(null);
    const [connectorUrl, setConnectorUrl] = useState('http://localhost:3000/postpipe/ingest');
    const [formId, setFormId] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setFormId(`form_${Math.random().toString(36).substring(2, 9)}`);
    }, []);

    // Fake Logs
    const [logs, setLogs] = useState<string[]>([]);
    const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p]);

    const generateCredentials = () => {
        const id = `pp_conn_${Math.random().toString(36).substring(2, 10)}`;
        const secret = `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
        setCredentials({ id, secret });
        addLog('✅ Generated new Connector Credentials');
        setStep(2);
    };

    const handleTestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addLog('🚀 Submitting form to Mock SaaS...');

        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => { data[key] = value as string; });

        try {
            // We manually append the "hidden" config fields because in a real specific form, 
            // these would be server-side config mapped to ID.
            // Here we cheat and send them so the mock API knows where to route without DB.
            const payload = {
                ...data,
                _connectorUrl: connectorUrl,
                _secret: credentials?.secret,
                _formId: formId
            };

            const res = await fetch('/api/mock-saas/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (result.success) {
                addLog('✅ SaaS received & signed request.');
                addLog('✅ Connector accepted request (200 OK).');
                addLog(`💾 Stored: ${JSON.stringify(result.connectorResponse)}`);
            } else {
                addLog(`❌ Error: ${result.message}`);
            }
        } catch (err: any) {
            addLog(`❌ Network Error: ${err.message}`);
        }
    };

    // Embeddable HTML Code
    const embedCode = `
<form action="/api/mock-saas/submit" method="POST">
  <!-- Actual End-User Fields -->
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>

  <!-- Demo Only: Hidden Configuration (Normally stored in PostPipe DB) -->
  <input type="hidden" name="_connectorUrl" value="${connectorUrl}" />
  <input type="hidden" name="_secret" value="${credentials?.secret || '...'}" />
  <input type="hidden" name="_formId" value="${formId}" />
</form>
`.trim();

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT COLUMN: Controls */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h1 className="text-2xl font-bold mb-2 text-indigo-600">PostPipe 2.0 Lab</h1>
                        <p className="text-sm text-gray-500 mb-6">Simulates the PostPipe SaaS Dashboard & User Flow.</p>

                        {/* Step 1: Config */}
                        <div className={`transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <h2 className="text-sm uppercase tracking-wide font-bold text-gray-400 mb-2">Step 1: Configure Connector</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Your Local Connector URL</label>
                                    <input
                                        type="text"
                                        value={connectorUrl}
                                        onChange={e => setConnectorUrl(e.target.value)}
                                        className="w-full mt-1 p-2 border rounded font-mono text-sm bg-gray-50"
                                    />
                                    <p className="text-xs text-amber-600 mt-1">Make sure you are running the connector on this port!</p>
                                </div>

                                {credentials ? (
                                    <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                        <div className="mb-2 text-green-400"># Put this in your Connector's .env</div>
                                        <div>POSTPIPE_CONNECTOR_ID={credentials.id}</div>
                                        <div>POSTPIPE_CONNECTOR_SECRET={credentials.secret}</div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={generateCredentials}
                                        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium"
                                    >
                                        Generate Credentials
                                    </button>
                                )}
                            </div>
                        </div>

                        <hr className="my-6 border-dashed" />

                        {/* Step 2: Form Code */}
                        <div className={`transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <h2 className="text-sm uppercase tracking-wide font-bold text-gray-400 mb-2">Step 2: Get Embed Code</h2>
                            <div className="bg-gray-100 p-3 rounded text-xs font-mono mb-2 overflow-x-auto">
                                <pre>{embedCode}</pre>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(embedCode)}
                                className="text-xs text-indigo-600 hover:underline"
                            >
                                Copy to Clipboard
                            </button>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-64 overflow-y-auto border border-gray-800">
                        <div className="sticky top-0 bg-black pb-2 border-b border-gray-800 mb-2 font-bold text-gray-500">Live Logs</div>
                        {logs.length === 0 && <div className="text-gray-600 italic">Waiting...</div>}
                        {logs.map((L, i) => <div key={i}>{L}</div>)}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Test Site */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="border-b pb-4 mb-6">
                        <h2 className="text-xl font-bold">My Static Site</h2>
                        <p className="text-gray-400 text-sm">Visualizing "index.html"</p>
                    </div>

                    {!credentials ? (
                        <div className="h-40 flex items-center justify-center text-gray-300 bg-gray-50 rounded border-2 border-dashed">
                            Form will appear here...
                        </div>
                    ) : (
                        <form onSubmit={handleTestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="test@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Hello world..."
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit Form
                                </button>
                                <p className="mt-2 text-xs text-center text-gray-400">
                                    Submits to Mock SaaS → Signs → Forwards to Localhost:3000
                                </p>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
