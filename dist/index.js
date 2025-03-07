"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailNotifierSDK = void 0;
class MailNotifierSDK {
    constructor(baseUrl = 'https://mail-notifier-production.up.railway.app', token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    sendEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/api/webhook/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${this.token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/api/webhook/email/status`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }
    // Convenience methods
    sendInfo(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendEmail(Object.assign(Object.assign({}, payload), { eventType: 'info' }));
        });
    }
    sendError(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendEmail(Object.assign(Object.assign({}, payload), { eventType: 'error' }));
        });
    }
    sendWarning(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendEmail(Object.assign(Object.assign({}, payload), { eventType: 'warning' }));
        });
    }
    sendSuccess(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendEmail(Object.assign(Object.assign({}, payload), { eventType: 'success' }));
        });
    }
}
exports.MailNotifierSDK = MailNotifierSDK;
exports.default = MailNotifierSDK;
