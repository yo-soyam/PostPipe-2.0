"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReadToken = validateReadToken;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Validates a PostPipe Read Token.
 * Token Format: pp_read_PayloadBase64Url.SignatureHex
 *
 * Payload structure (inside Base64):
 * {
 *   "formId": "contact-us",
 *   "exp": 1234567890
 * }
 */
function validateReadToken(token, formId, secret) {
    if (!token || !token.startsWith('pp_read_')) {
        return false;
    }
    const raw = token.slice('pp_read_'.length);
    const [payloadB64, signature] = raw.split('.');
    if (!payloadB64 || !signature) {
        return false;
    }
    // 1. Verify Signature
    const expectedSignature = crypto_1.default
        .createHmac('sha256', secret)
        .update(payloadB64)
        .digest('hex');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) {
        return false;
    }
    if (!crypto_1.default.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return false;
    }
    // 2. Decode Payload and Check Scopes
    try {
        const payloadStr = Buffer.from(payloadB64, 'base64url').toString();
        const payload = JSON.parse(payloadStr);
        // Check Expiry (if present)
        if (payload.exp && Date.now() > payload.exp * 1000) {
            return false;
        }
        // Check Scope
        if (payload.formId !== formId) {
            return false;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
