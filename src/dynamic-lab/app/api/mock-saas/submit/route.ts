export const dynamic = 'force-dynamic'; // Ensure no caching

import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Parse content
    // We expect a standard form submission or JSON
    const contentType = req.headers.get('content-type') || '';
    let bodyData: any = {};

    if (contentType.includes('application/json')) {
      bodyData = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        bodyData[key] = value;
      });
    }

    // 2. Extract Configuration (simulating SaaS looking up user config)
    // For the demo, we pass these as hidden fields or query params to keep it simple
    // In real life, PostPipe looks this up from DB based on formId.
    
    // We'll look for special keys that shouldn't be forwarded to DB
    const connectorUrl = bodyData._connectorUrl || 'http://localhost:3000/postpipe/ingest';
    const secret = bodyData._secret || 'my-super-secret-key';
    const formId = bodyData._formId || 'demo_form_123';
    
    // Remove "SaaS-only" control fields from the payload meant for the DB
    const { _connectorUrl, _secret, _formId, ...actualFormData } = bodyData;

    // 3. Prepare Payload for Connector
    const now = new Date();
    const payload = {
      formId: formId,
      submissionId: crypto.randomUUID(),
      timestamp: now.toISOString(),
      data: actualFormData,
      // We will sign this payload
    };

    // 4. Sign the Payload
    // Signature = HMAC-SHA256( JSON.stringify(payload) )
    // IMPORTANT: The Connector expects the RAW body to be signed.
    // So we must stringify carefully.
    const rawBody = JSON.stringify(payload);
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    // 5. Forward to Connector
    console.log(`[MockSaaS] Forwarding to ${connectorUrl}`);
    console.log(`[MockSaaS] Signature: ${signature.substring(0, 10)}...`);

    const response = await fetch(connectorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PostPipe-Signature': signature, // Standard Header
      },
      body: rawBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { success: false, message: `Connector rejected: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return Response.json({ success: true, connectorResponse: result });

  } catch (error: any) {
    console.error("[MockSaaS] Error:", error);
    const msg = error.cause?.code === 'ECONNREFUSED' 
      ? `Could not connect to Connector at ${bodyData?._connectorUrl || 'URL'}. Is it running?`
      : error.message;
      
    return Response.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
