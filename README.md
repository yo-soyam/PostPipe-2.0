# PostPipe 2.0 Lab 🧪

Welcome to the development and testing ground for PostPipe 2.0.
This repository contains the CLI tools, the API simulation, and the "Dynamic Lab" for testing integrations.

## 🚀 Quick Start (Connector Demo)

We have a fully simulated environment to test the **Zero Trust Connector** flow (`Browser -> PostPipe SaaS -> User Connector -> DB`).

### Prerequisites

- Node.js 18+
- Docker (Optional, if testing container deployment)
- MongoDB / Postgres (Local or Cloud)

### Step 1: Start the SaaS Simulation

Run the "Dynamic Lab" (Next.js App) which hosts the Dashboard and Mock Ingest API.

```bash
npm run dev:lab
# Runs on http://localhost:3000
```

### Step 2: Create & Run a Connector

In a **new terminal**, generate and run a secure connector.

```bash
# 1. Generate Connector
node cli/create-postpipe-connector/dist/index.js my-test-connector

# 2. Install & Configure
cd my-test-connector
npm install

# 3. CRITICAL: Change Port to 3001
# Open .env and set:
# PORT=3001

# 4. Start Connector
npm run dev
```

### Step 3: Test the Flow

1.  Open [http://localhost:3000/connector-demo](http://localhost:3000/connector-demo).
2.  Enter your Connector URL: `http://localhost:3001/postpipe/ingest`
3.  Click **Generate Credentials**.
4.  Copy the `POSTPIPE_CONNECTOR_ID` and `SECRET` to your connector's `.env`.
5.  Restart the connector terminal.
6.  Submit the form on the Demo Page!

---

## 📂 Project Structure

- `cli/` - Source code for all CLI tools (`create-postpipe-auth`, `create-postpipe-connector`, etc).
- `src/dynamic-lab/` - The Next.js application simulating the SaaS Dashboard.
- `src/static-server/` - Legacy logic (moved to dynamic-lab).

## 🛠️ CLI Tools

| Command                     | Description                                   |
| :-------------------------- | :-------------------------------------------- |
| `create-postpipe-connector` | Scaffolds the self-hosted database connector. |
| `create-postpipe-auth`      | Scaffolds authentication logic.               |

## 🐛 Troubleshooting

**"Connection Refused"**

- Ensure your Connector is running on a _different_ port (3001) than the Lab (3000).
- Check your `.env` config.

**"Invalid Signature"**

- Ensure the `SECRET` in the Demo Page matches the `POSTPIPE_CONNECTOR_SECRET` in your `.env`.
