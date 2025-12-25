"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
const secret = process.env.POSTPIPE_CONNECTOR_SECRET;
const ingestUrl = 'http://localhost:3001/postpipe/ingest';
async function run() {
    console.log("🔍 Diagnosing PostPipe Connector...");
    // 1. Test MongoDB
    console.log("\n1. Testing MongoDB Connection...");
    if (!uri) {
        console.error("❌ MONGODB_URI is missing in .env");
        return;
    }
    try {
        // @ts-ignore
        const client = new mongodb_1.MongoClient(uri);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME || 'postpipe');
        await db.command({ ping: 1 });
        console.log("✅ MongoDB Connection Successful!");
        const collections = await db.listCollections().toArray();
        console.log("   Collections:", collections.map(c => c.name).join(', '));
        await client.close();
    }
    catch (e) {
        console.error(`❌ MongoDB Failed: ${e.message}`);
        return; // Stop if DB fails
    }
    // 2. Test Connector Webhook
    console.log(`\n2. Testing Connector Endpoint (${ingestUrl})...`);
    const payload = {
        formId: 'diagnostic-test',
        submissionId: 'diag_' + Date.now(),
        timestamp: new Date().toISOString(),
        data: { msg: 'hello from diagnostic script' },
        signature: "legacy"
    };
    const bodyString = JSON.stringify(payload);
    // @ts-ignore
    const signature = crypto_1.default.createHmac('sha256', secret).update(bodyString).digest('hex');
    try {
        // @ts-ignore
        const res = await (0, node_fetch_1.default)(ingestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-postpipe-signature': signature
            },
            body: bodyString
        });
        const text = await res.text();
        console.log(`   Response Status: ${res.status}`);
        console.log(`   Response Body: ${text}`);
        if (res.status === 200) {
            console.log("✅ Connector is UP and accepting data!");
        }
        else {
            console.error("❌ Connector rejected the request.");
        }
    }
    catch (e) {
        console.error(`❌ Could not reach Connector: ${e.message}`);
        console.error("   Is 'npm run dev' running?");
    }
}
run();
