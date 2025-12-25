import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

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
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB_NAME || 'postpipe');
      await db.command({ ping: 1 });
      console.log("✅ MongoDB Connection Successful!");
      
      const collections = await db.listCollections().toArray();
      console.log("   Collections:", collections.map(c => c.name).join(', '));
      
      await client.close();
  } catch (e: any) {
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
  const signature = crypto.createHmac('sha256', secret).update(bodyString).digest('hex');
  
  try {
      // @ts-ignore
      const res = await fetch(ingestUrl, {
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
      } else {
          console.error("❌ Connector rejected the request.");
      }
      
  } catch (e: any) {
      console.error(`❌ Could not reach Connector: ${e.message}`);
      console.error("   Is 'npm run dev' running?");
  }
}

run();
