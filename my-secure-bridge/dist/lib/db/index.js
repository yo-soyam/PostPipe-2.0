"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdapter = getAdapter;
const mongodb_1 = require("./mongodb");
const postgres_1 = require("./postgres");
const supabase_1 = require("./supabase");
function getAdapter() {
    const type = process.env.DB_TYPE?.toLowerCase();
    switch (type) {
        case 'mongodb':
            return new mongodb_1.MongoAdapter();
        case 'postgres':
        case 'postgresql':
            return new postgres_1.PostgresAdapter();
        case 'supabase':
            return new supabase_1.SupabaseAdapter();
        default:
            console.warn(`[Config] No valid DB_TYPE set (got '${type}'). Defaulting to Memory (Dry Run).`);
            return new MemoryAdapter();
    }
}
class MemoryAdapter {
    async connect() {
        console.log("[MemoryAdapter] Connected (Data will be lost on restart)");
    }
    async insert(payload) {
        console.log("[MemoryAdapter] Received:", JSON.stringify(payload, null, 2));
    }
    async find(formId, options) {
        console.log("[MemoryAdapter] Find called");
        return { data: [], nextCursor: undefined };
    }
}
