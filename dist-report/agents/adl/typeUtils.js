"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureIndependenceLevel = ensureIndependenceLevel;
exports.ensureString = ensureString;
exports.ensureActivity = ensureActivity;
function ensureIndependenceLevel(level) {
    return level || 'not_applicable';
}
function ensureString(value) {
    return value || '';
}
function ensureActivity(activity) {
    return {
        notes: ensureString(activity.notes),
        independence: ensureIndependenceLevel(activity.independence)
    };
}
