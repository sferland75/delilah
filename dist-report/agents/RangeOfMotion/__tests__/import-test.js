"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('Test Environment', () => {
    (0, globals_1.it)('should run basic test', () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
